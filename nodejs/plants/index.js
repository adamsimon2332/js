import express from "express";
import __dirname from "./util/rootpath.js"

const app = express();
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile('./views/index.html', {root: __dirname});
});

app.get("/flowers", (req, res) => {
    res.sendFile("./views/flowers.html", { root: __dirname });
});

app.use((req, res) => {
    res.status(404).sendFile("./views/404.html", { root: __dirname });
});

app.get('/:parameter', (req, res) => {
    const param = req.params.parameter;
    console.log(param);
    res.send(param);
});

app.post("/", (req, res) => {
    const {name, category} = req.body;
    console.log(`Name: ${name} category: ${category}`);
    res.json({name, category})
})

app.listen(3010, () => {
    console.log('Server runs on port 3010');
});