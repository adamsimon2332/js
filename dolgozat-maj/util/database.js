import Database from "better-sqlite3";

const db = new Database('./data/database.sqlite')

db.prepare(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title STRING,
    author STRING
)`).run()

export const getAllBooks = () => db.prepare(`SELECT * FROM books`).all()
export const getBookById = (id) => db.prepare(`SELECT * FROM books WHERE id = ?`).get(id)
export const addBook = (title, author) => db.prepare(`INSERT INTO books (title, author) VALUES (?, ?)`).run(title, author)
export const deleteBook = (id) => db.prepare(`DELETE FROM books WHERE id = ?`).run(id)

const books = [
    {title: 'test1', author: 'test1'}, {title: 'test2', author: 'test2'}, {title: 'test3', author: 'test3'}, {title: 'test4', author: 'test4'},
]
books.forEach((book) => {
    db.prepare(`INSERT INTO books (title, author) VALUES (?, ?)`).run(book.title, book.author)
})