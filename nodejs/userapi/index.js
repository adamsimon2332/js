import express from "express";
import __dirname from "./util/rootpath.js"

const app = express();
app.use(express.json())

const users = [
    { firstName: "Harry", lastName: "Potter" },
    { firstName: "Ronald", lastName: "Bilius Weasley" },
    { firstName: "Hermione", lastName: "Jean Granger" },
    { firstName: "Draco", lastName: "Malfoy" },
    { firstName: "Cedric", lastName: "Diggory" },
    { firstName: "Luna", lastName: "Lovegood" },
]

app.get('/', (req, res) => {
    res.sendFile('./views/index.html', {root: __dirname});
});

app.get('/users', (req, res) => {
    res.send(users)
})

app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (id >= 0 && id < users.length) {
      res.json(users[id]);
    } else {
      res.json({});
    }
  });
  
app.post('/users', (req, res) => {
    const { firstName, lastName } = req.body;
    if (firstName && lastName) {
        users.push({ firstName, lastName });
        res.status(201).json({ firstName, lastName });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
});

app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { firstName, lastName } = req.body;

    if (id >= 0 && id < users.length) {
        users[id] = { firstName, lastName };
        res.json(users[id]);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

app.patch('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { firstName, lastName } = req.body;

    if (id >= 0 && id < users.length) {
        if (firstName) users[id].firstName = firstName;
        if (lastName) users[id].lastName = lastName;
        res.json(users[id]);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (id >= 0 && id < users.length) {
        users.splice(id, 1);
        res.json({ message: "Delete successful" });
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

app.listen(3010, () => {
    console.log('Server runs on port 3010');
});