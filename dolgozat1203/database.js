import Database from "better-sqlite3"

const db = new Database("./database/database.sqlite")

db.prepare(`CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL
)`).run();

export const getCars = () => db.prepare(`SELECT * FROM cars`).all()
export const getCarById = (id) => db.prepare(`SELECT * FROM cars WHERE id = ?`).get(id);
export const createCar = (brand, model, year) => db.prepare(`INSERT INTO cars (brand, model, year) VALUES (?, ?, ?)`).run(brand, model, year)
export const editCar = (brand, model, year, id) => db.prepare("UPDATE cars SET brand = ?, model = ?, year = ? WHERE id = ?").run(brand, model, year, id)

const count = db.prepare("SELECT COUNT(*) as count from cars").get().count;
if(count === 0) {
    const insert = db.prepare(`INSERT INTO cars (brand, model, year) VALUES (?, ?, ?)`)
    insert.run("Audi", "A6", 2006)
    insert.run("BMW", "M5 E60", 2004)
    insert.run("Mercedes", "C180", 2009)
}