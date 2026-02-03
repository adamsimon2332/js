import express from "express";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
const csvParse = parse;
const app = express();
app.use(express.json());

const dbPath = path.join("nyiltnap.db");
let db;

function initDatabase() {
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS diakok (
      id INTEGER PRIMARY KEY,
      nev TEXT NOT NULL,
      email TEXT NOT NULL,
      telefon TEXT NOT NULL,
      telepules TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS orak (
      id INTEGER PRIMARY KEY,
      datum DATE NOT NULL,
      targy TEXT NOT NULL,
      csoport TEXT NOT NULL,
      terem TEXT NOT NULL,
      tanar TEXT NOT NULL,
      ferohely INTEGER NOT NULL,
      orasorszam INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS kapcsolo (
      id INTEGER PRIMARY KEY,
      diakid INTEGER NOT NULL,
      oraid INTEGER NOT NULL,
      FOREIGN KEY(diakid) REFERENCES diakok(id),
      FOREIGN KEY(oraid) REFERENCES orak(id)
    );
  `);

  if (fs.existsSync(path.join("diakok.csv"))) {
    const diakokCSV = fs.readFileSync(path.join("diakok.csv"), "utf8");
    const diakok = csvParse(diakokCSV, {
      columns: true,
      skip_empty_lines: true,
    });
    const insertDiak = db.prepare(
      "INSERT INTO diakok (id, nev, email, telefon, telepules) VALUES (?, ?, ?, ?, ?)",
    );
    for (const d of diakok) {
      insertDiak.run(Number(d.id), d.nev, d.email, d.telefon, d.telepules);
    }
  }

  if (fs.existsSync(path.join("orak.csv"))) {
    const orakCSV = fs.readFileSync(path.join("orak.csv"), "utf8");
    const orak = csvParse(orakCSV, { columns: true, skip_empty_lines: true });
    const insertOra = db.prepare(
      "INSERT INTO orak (id, datum, targy, csoport, terem, tanar, ferohely, orasorszam) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    );
    for (const o of orak) {
      insertOra.run(
        Number(o.id),
        o.datum,
        o.targy,
        o.csoport,
        o.terem,
        o.tanar,
        Number(o.ferohely),
        Number(o.orasorszam),
      );
    }
  }

  if (fs.existsSync(path.join("kapcsolat.csv"))) {
    const kapcsoloCSV = fs.readFileSync(path.join("kapcsolat.csv"), "utf8");
    const kapcsolo = csvParse(kapcsoloCSV, {
      columns: true,
      skip_empty_lines: true,
    });
    const insertKapcsolo = db.prepare(
      "INSERT INTO kapcsolo (id, diakid, oraid) VALUES (?, ?, ?)",
    );
    for (const k of kapcsolo) {
      insertKapcsolo.run(Number(k.id), Number(k.diakid), Number(k.oraid));
    }
  }
}

initDatabase();

const router = express.Router();

router.get("/telepules", (req, res) => {
  const nev = req.query.nev;
  if (!nev) return res.status(400).json({ message: "Missing 'nev' parameter" });
  const rows = db
    .prepare("SELECT nev FROM diakok WHERE telepules = ? ORDER BY nev ASC")
    .all(nev);
  res.json(rows.map((r) => r.nev));
});

router.get("/tanora", (req, res) => {
  const rows = db
    .prepare(
      "SELECT datum, terem, orasorszam FROM orak WHERE targy = 'angol' ORDER BY datum ASC, orasorszam ASC",
    )
    .all();
  res.json(rows);
});

router.get("/9-matematika-fizika", (req, res) => {
  const rows = db
    .prepare(
      `SELECT csoport, targy, datum FROM orak WHERE csoport LIKE '9%' AND (targy = 'matematika' OR targy = 'fizika') ORDER BY targy ASC`,
    )
    .all();
  res.json(rows);
});

router.get("/telepulesfo", (req, res) => {
  const rows = db
    .prepare(
      `SELECT telepules, COUNT(*) AS letszam FROM diakok GROUP BY telepules ORDER BY letszam DESC`,
    )
    .all();
  res.json(rows);
});

router.get("/tantargyak", (req, res) => {
  const rows = db
    .prepare(`SELECT DISTINCT targy FROM orak ORDER BY targy ASC`)
    .all();
  res.json(rows.map((r) => r.targy));
});

router.get("/tanar", (req, res) => {
  const nev = req.query.nev;
  const datum = req.query.datum;
  if (!nev || !datum)
    return res
      .status(400)
      .json({ message: "Missing 'nev' or 'datum' parameter" });
  const rows = db
    .prepare(
      `
    SELECT d.nev, d.email, d.telefon
    FROM diakok d
    JOIN kapcsolo k ON d.id = k.diakid
    JOIN orak o ON k.oraid = o.id
    WHERE o.tanar = ? AND o.datum = ?
    ORDER BY d.nev ASC
  `,
    )
    .all(nev, datum);
  res.json(rows);
});

router.get("/telepulesrol", (req, res) => {
  const nev = req.query.nev;
  if (!nev) return res.status(400).json({ message: "Missing 'nev' parameter" });
  const diak = db
    .prepare("SELECT telepules FROM diakok WHERE nev = ?")
    .get(nev);
  if (!diak) return res.status(404).json({ message: "Diák nem található" });
  const rows = db
    .prepare(
      "SELECT nev FROM diakok WHERE telepules = ? AND nev != ? ORDER BY nev ASC",
    )
    .all(diak.telepules, nev);
  res.json(rows.map((r) => r.nev));
});

router.get("/szabad", (req, res) => {
  const rows = db
    .prepare(
      `
    SELECT o.id, o.datum, o.targy, o.csoport, o.terem, o.tanar, o.ferohely,
      o.orasorszam,
      (o.ferohely - IFNULL((SELECT COUNT(*) FROM kapcsolo k WHERE k.oraid = o.id), 0)) AS szabad
    FROM orak o
    WHERE (o.ferohely - IFNULL((SELECT COUNT(*) FROM kapcsolo k WHERE k.oraid = o.id), 0)) > 0
    ORDER BY szabad DESC
  `,
    )
    .all();
  res.json(rows);
});

app.use("/nyiltnap/api/v1", router);

const PORT = 3321;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
