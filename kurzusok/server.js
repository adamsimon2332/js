import express from "express";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
const csvParse = parse;
const app = express();
app.use(express.json());

const dbPath = path.join("kurzusok.db");
let db;

function initDatabase() {
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  db = new Database(dbPath);

  db.exec(`
    CREATE TABLE students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      class TEXT NOT NULL
    );
    CREATE TABLE subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
    CREATE TABLE classmembers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      UNIQUE(subject_id, student_id),
      FOREIGN KEY(subject_id) REFERENCES subjects(id),
      FOREIGN KEY(student_id) REFERENCES students(id)
    );
  `);

  const studentsCSV = fs.readFileSync(path.join("students.csv"), "utf8");
  const students = csvParse(studentsCSV, {
    columns: true,
    skip_empty_lines: true,
  });
  const insertStudent = db.prepare(
    "INSERT INTO students (id, firstname, lastname, class) VALUES (?, ?, ?, ?)",
  );
  for (const s of students) {
    insertStudent.run(
      Number(s.id),
      s.firstname,
      s.lastname,
      s.classes || s.class,
    );
  }

  const subjectsCSV = fs.readFileSync(path.join("subjects.csv"), "utf8");
  const subjects = csvParse(subjectsCSV, {
    columns: true,
    skip_empty_lines: true,
  });
  const insertSubject = db.prepare(
    "INSERT INTO subjects (id, name) VALUES (?, ?)",
  );
  for (const subj of subjects) {
    insertSubject.run(Number(subj.id), subj.name);
  }

  const classmembersCSV = fs.readFileSync(
    path.join("classmembers.csv"),
    "utf8",
  );
  const classmembers = csvParse(classmembersCSV, {
    columns: true,
    skip_empty_lines: true,
  });
  const insertClassmember = db.prepare(
    "INSERT INTO classmembers (id, subject_id, student_id) VALUES (?, ?, ?)",
  );
  for (const cm of classmembers) {
    insertClassmember.run(
      Number(cm.id),
      Number(cm.subject_id),
      Number(cm.student_id),
    );
  }
}

initDatabase();

app.get("/students/:id", (req, res) => {
  const student = db
    .prepare("SELECT * FROM students WHERE id = ?")
    .get(req.params.id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  res.json(student);
});

app.get("/subjects", (req, res) => {
  const subjects = db
    .prepare("SELECT name FROM subjects ORDER BY name ASC")
    .all();
  res.json(subjects.map((s) => s.name));
});

app.get("/students", (req, res) => {
  const className = req.query.class;
  if (!className)
    return res.status(400).json({ message: "Missing class parameter" });
  const students = db
    .prepare(
      "SELECT firstname, lastname FROM students WHERE class = ? ORDER BY lastname ASC, firstname ASC",
    )
    .all(className);
  res.json(students.map((s) => `${s.lastname} ${s.firstname}`));
});

app.post("/courses", (req, res) => {
  const { firstname, lastname, class: className, subject } = req.body;
  if (!firstname || !lastname || !className || !subject) {
    return res.status(400).json({ message: "Missing data" });
  }

  let student = db
    .prepare(
      "SELECT * FROM students WHERE firstname = ? AND lastname = ? AND class = ?",
    )
    .get(firstname, lastname, className);
  if (!student) {
    const result = db
      .prepare(
        "INSERT INTO students (firstname, lastname, class) VALUES (?, ?, ?)",
      )
      .run(firstname, lastname, className);
    student = {
      id: result.lastInsertRowid,
      firstname,
      lastname,
      class: className,
    };
  }

  let subj = db.prepare("SELECT * FROM subjects WHERE name = ?").get(subject);
  if (!subj) {
    const result = db
      .prepare("INSERT INTO subjects (name) VALUES (?)")
      .run(subject);
    subj = { id: result.lastInsertRowid, name: subject };
  }

  const exists = db
    .prepare(
      "SELECT * FROM classmembers WHERE subject_id = ? AND student_id = ?",
    )
    .get(subj.id, student.id);
  if (exists) {
    return res.status(400).json({
      message: `${student.firstname} ${student.lastname} already study ${subj.name}.`,
    });
  }

  db.prepare(
    "INSERT INTO classmembers (subject_id, student_id) VALUES (?, ?)",
  ).run(subj.id, student.id);
  res.json({
    message: `${student.firstname} ${student.lastname} from ${student.class} study ${subj.name}`,
  });
});

const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
