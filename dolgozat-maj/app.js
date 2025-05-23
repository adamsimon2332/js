import express from "express";
import * as db from "./util/database.js";

const PORT = 8080;
const app = express();
app.use(express.json());

app.get("/books", (req, res) => {
    try {
        const books = db.getAllBooks();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: `${error}`});
    }
});

app.get("/books/:id", (req, res) => {
    try {
        const book = db.getBookById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: `${error}`});
    }
});

app.post("/books", (req, res) => {
    try {
        const { title, author, } = req.body;
        if (!title || !author) {
            return res.status(400).json({ message: "Invalid fields" });
        }
        const newBook = db.addBook(title, author);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: `${error}`});
    }
});

app.delete("/books/:id", (req, res) => {
    try {
        const deletedBook = db.deleteBook(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(204).json(deletedBook);
    } catch (error) {
        res.status(500).json({ message: `${error}`});
    }
});

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);
});