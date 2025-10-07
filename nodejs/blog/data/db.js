import Database from "better-sqlite3";

const db = new Database("./data/database.sqlite");

db.prepare(
  `CREATE TABLE IF NOT EXISTS users (  
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name STRING,
    email STRING,
    password STRING
)`
).run();

db.prepare(
  `CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    title STRING,
    content STRING,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`
  ).run();