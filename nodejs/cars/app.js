import express from "express";
import __dirname from "./util/rootpath.js"

const app = express();

app.get("/", (req, res) => {
    res.sendFile("./views/index.html", { root: __dirname });
});

app.get("/car", (req, res) => {
    res.sendFile("./views/car.html", { root: __dirname });
});

app.use((req, res) => {
    res.status(404).sendFile("./views/404.html", { root: __dirname });
});

app.listen(3000, () => {
    console.log('Server runs on port 3000');
});