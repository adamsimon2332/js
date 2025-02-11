import express from "express";

const app = express();

app.use(express.static("views"));

app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.listen(3001, () => {
    console.log('Server runs on port 3001');
});