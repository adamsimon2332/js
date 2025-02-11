import express from "express";

const app = express();

app.get("/index", (req, res) => {
    res.sendFile("./views/index.html", { root: __dirname });
});

app.listen(3001, () => {
    console.log('Server runs on port 3001');
});