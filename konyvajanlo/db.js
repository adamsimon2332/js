const Database = require("better-sqlite3");
const fs = require("node:fs");
const path = require("node:path");

const dbFile = path.join(__dirname, "database.sqlite");
const schemaFile = path.join(__dirname, "schema.sql");

const db = new Database(dbFile);

const tables = db
	.prepare("SELECT name FROM sqlite_master WHERE type='table'")
	.all();
if (tables.length === 0) {
	const schema = fs.readFileSync(schemaFile, "utf8");
	db.exec(schema);
}

module.exports = db;
