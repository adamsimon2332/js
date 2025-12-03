import express from "express"
import * as db from "./database.js"

const port = 8080;

const app = express()
app.use(express.json())

app.get("/cars", (req, res) => {
    try {
        const cars = db.getCars()
        res.json(cars)
    } catch(error) {
        res.status(500).json({error: "Failed to get cars!"});
    }
});

app.get("/cars/:id", (req, res) => {
    const id = req.params.id
    try {
        const car = db.getCarById(id)
        if(car) {
            res.json(car)
        } else {
        res.status(404).json({error: "Car not found!"});
        }
    } catch(error) {
        res.status(500).json({error: "Failed to get car!"});
    }
});

app.post("/cars/", (req, res) => {
    const {brand, model, year} = req.body;
    if (!brand || !model || !year || typeof year !== number) {
        return res.status(400).json({error: "Invalid data!"});
    }
    try {
        const car = db.createCar(brand, model, year);
        if(car.changes === 1) {
            res.status(201).json({id: car.lastInsertRowid})
        } else {
            res.status(500).json({error: "Failed to create car!"});
        }
    } catch(error) {
        res.status(500).json({error: `${error}`});
    }
});

app.put("/cars/:id", (req, res) => {
    const id = req.params.id;
    
    const car = db.getCarById(id);
    if (!car) {
        return res.status(404).json({error: "Car not found!"})
    }

    const {brand, model, year} = req.body;
    if (!brand || !model || !year || typeof year !== number) {
        return res.status(400).json({error: "Invalid data!"});
    }
    try {
        const editedCar = db.editCar(brand, model, year, id)
        res.status(201).json(editedCar)
    } catch(error) {
        res.status(500).json({error: "Failed to edit car!"});
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})