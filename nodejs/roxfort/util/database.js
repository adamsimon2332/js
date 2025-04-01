import sqlite from 'sqlite3'

const db = new sqlite.Database('./data/database.sqlite')

export function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
        if (err) {
            reject(err)
        } else {
            resolve(rows)
        }
        })
    })
}

export function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
        if (err) {
            reject(err)
        } else {
            resolve(row)
        }
        })
    })
}

export function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
        if (err) {
            reject(err)
        } else {
            resolve(this)
        }
        })
    })
}

export async function dbInit() {
    await dbRun ("DROP TABLE IF EXISTS roxfort")
    await dbRun(`
        CREATE TABLE IF NOT EXISTS roxfort (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name STRING,
            magicWand STRING,
            house STRING
        )
    `)

    const roxfort = [
        { name: 'Alice', magicWand: 'Oak', house: 'Gryffindor' },
        { name: 'Bob', magicWand: 'Holly', house: 'Hufflepuff' },
        { name: 'Charlie', magicWand: 'Yew', house: 'Ravenclaw' }
    ];

    for (const roxfortStudents of roxfort) {
        await dbRun(`
            INSERT INTO roxfort (name, magicWand, house) VALUES (?, ?, ?)
        `, [roxfortStudents.name, roxfortStudents.magicWand, roxfortStudents.house])
    }
}