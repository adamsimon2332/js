import express from "express";

const app = express();

app.use(express.static("views"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/car", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "car.html"));
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000, () => {
    console.log('Server runs on port 3000');
});