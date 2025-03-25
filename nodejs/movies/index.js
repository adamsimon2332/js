import express from "express";
import __dirname from "./util/rootpath.js"

const app = express();
app.use(express.json())

const movies = [
    { title: "Harry Potter and the Philosopher's Stone", director: "Chris Columbus", year: 2001, hasOscar: false },
    { title: "Harry Potter ", director: "Chris Columbus", year: 2002, hasOscar: false },
    { title: "Harry Potter 532542342", director: "Chris Columbus", year: 2003, hasOscar: false },
    { title: "Harry Potter asas", director: "Chris Columbus", year: 2004, hasOscar: true },
    { title: "Harry Potter ffdsfdsfsa", director: "Chris Columbus", year: 2005, hasOscar: false },
]

app.get('/movies', (req, res) => {
    res.send(movies)
})

app.get('/movies:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (id >= 0 && id < movies.length) {
      res.json(movies[id]);
    } else {
      res.json({});
    }
})

app.post('/movies', (req, res) => {
    const { title, director, year, hasOscar } = req.body;
    if (title && director && year && hasOscar) {
        movies.push({ title, director, year, hasOscar });
        res.status(201).json({ title, director, year, hasOscar });
    } else {
        res.status(400).json({ message: "Invalid movie data" });
    }
})

app.put('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { title, director, year, hasOscar } = req.body;
    if (id >= 0 && id < movies.length && title && director && year && hasOscar) {
        movies[id] = { title, director, year, hasOscar };
        res.json({ title, director, year, hasOscar });
    } else {
        res.status(400).json({ message: "Invalid movie data" });
    }
})

app.delete('/movies:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (id >= 0 && id < movies.length) {
        const movie = movies[id];
        movies.splice(id, 1);
        res.json(movie);
    } else {
        res.json({});
    }
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})