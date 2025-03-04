import express from "express";
import __dirname from "./util/rootpath.js"

const app = express();
app.use(express.json())

const wizards = [
    { name: "Harry Potter", magicWand: "Elder Wand", house: "Gryffindor" },
    { name: "Hermione Granger", magicWand: "Unicorn hair, vine wood", house: "Gryffindor" },
    { name: "Ron Weasley", magicWand: "Willow, unicorn hair", house: "Gryffindor" },
    { name: "Albus Dumbledore", magicWand: "Elder Wand", house: "Gryffindor" },
    { name: "Severus Snape", magicWand: "Ebony, dragon heartstring", house: "Slytherin" },
    { name: "Draco Malfoy", magicWand: "Holly, phoenix feather", house: "Slytherin" }
];

app.get('/wizards', (req, res) => {
    res.send(wizards)
})

app.get('/wizards/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (id >= 0 && id < wizards.length) {
      res.json(wizards[id]);
    } else {
      res.json({});
    }
  });
  
app.post('/wizards', (req, res) => {
    const { name, magicWand, house } = req.body;
    if (name && magicWand && house) {
        wizards.push({ name, magicWand, house });
        res.status(201).json({ name, magicWand, house });
    } else {
        res.status(400).json({ message: "Invalid wizard data" });
    }
});

app.put('/wizards/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name, magicWand, house } = req.body;

    if (name && magicWand && house) {
        if (id >= 0 && id < wizards.length) {
            wizards[id] = { name, magicWand, house };
            res.json(wizards[id]);
        } else {
            res.status(404).json({ message: "Wizard not found" });
        }
    } else {
        res.status(400).json({ message: "Invalid wizard data" });
    }
});

app.delete('/wizards/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (id >= 0 && id < wizards.length) {
        wizards.splice(id, 1);
        res.json({ message: "Delete successful" });
    } else {
        res.status(404).json({ message: "Wizard not found" });
    }
});

app.listen(3010, () => {
    console.log('Server runs on port 3010');
});