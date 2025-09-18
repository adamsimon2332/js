import express from "express";

const app = express();
app.use(express.json())

const cars = [
    {brand: "BMW", type: "M5 E60"},
    {brand: "Audi", type: "RS6"},
    {brand: "Mercedes", type: "C220"}
]

app.get("/cars", (req, res) => {
    res.send(cars)
})

app.get("/cars/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (!user) {
        res.status(404).json({message: 'User not found'})
    }
    res.status(200).json(users[id])
})

app.listen(3000, () => {
    console.log('Server runs on port 3000');
});