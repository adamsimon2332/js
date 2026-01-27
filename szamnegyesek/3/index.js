const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const app = express();
app.use(cors());
app.use(express.json());

const db = new Database("fours.db");
db.exec(`CREATE TABLE IF NOT EXISTS fours (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  n1 INTEGER NOT NULL,
  n2 INTEGER NOT NULL,
  n3 INTEGER NOT NULL,
  n4 INTEGER NOT NULL
)`);

function isValidFour(arr) {
  return Array.isArray(arr) && arr.length === 4 && arr.every(Number.isFinite);
}

app.get("/fours", (req, res) => {
  const rows = db.prepare("SELECT * FROM fours").all();
  const result = rows.map((row) => ({
    id: row.id,
    numbers: [row.n1, row.n2, row.n3, row.n4],
  }));
  res.json(result);
});

app.get("/fours/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const row = db.prepare("SELECT * FROM fours WHERE id = ?").get(id);

  if (!row) {
    return res.status(404).json({ error: "Not found" });
  }
  res.json({ id: row.id, numbers: [row.n1, row.n2, row.n3, row.n4] });
});

app.post("/fours", (req, res) => {
  const numbers = req.body.numbers;
  if (!isValidFour(numbers)) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const exists = db
    .prepare(
      "SELECT id FROM fours WHERE n1 = ? AND n2 = ? AND n3 = ? AND n4 = ?",
    )
    .get(numbers[0], numbers[1], numbers[2], numbers[3]);
  if (exists) {
    return res.status(409).json({ error: "Already exists" });
  }

  const info = db
    .prepare("INSERT INTO fours (n1, n2, n3, n4) VALUES (?, ?, ?, ?)")
    .run(numbers[0], numbers[1], numbers[2], numbers[3]);
  res.status(201).json({ id: info.lastInsertRowid, numbers });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
