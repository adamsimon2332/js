import express from "express";
import __dirname from "./util/rootpath.js"

const app = express();
app.use(express.json())

const books = [
    { author: "J.K. Rowling", title: "Harry Potter and the Philosopher's Stone", year: 1997 },
    { author: "J.R.R. Tolkien", title: "The Fellowship of the Ring", year: 1954 },
    { author: "George Orwell", title: "1984", year: 1949 },
    { author: "J.D. Salinger", title: "The Catcher in the Rye", year: 1951 },
    { author: "F. Scott Fitzgerald", title: "The Great Gatsby", year: 1925 },
    { author: "Harper Lee", title: "To Kill a Mockingbird", year: 1960 }
];

app.get('/books', (req, res) => {
    res.send(books)
})

app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (id >= 0 && id < books.length) {
      res.json(books[id]);
    } else {
      res.json({});
    }
  });
  
app.post('/books', (req, res) => {
    const { author, title, year } = req.body;
    if (author && title && year) {
        books.push({ author, title, year });
        res.status(201).json({ author, title, year });
    } else {
        res.status(400).json({ message: "Invalid book data" });
    }
});

app.put('/books/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { author, title, year } = req.body;

    if (author && title && year) {
        if (id >= 0 && id < books.length) {
            books[id] = { author, title, year };
            res.json(books[id]);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } else {
        res.status(400).json({ message: "Invalid book data" });
    }
});

app.delete('/books/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (id >= 0 && id < books.length) {
        books.splice(id, 1);
        res.json({ message: "Delete successful" });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

app.listen(3010, () => {
    console.log('Server runs on port 3010');
});