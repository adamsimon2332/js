import express from "express";
import __dirname from "./util/rootpath.js"

const app = express();
app.use(express.json())

const flowers = [
    {"name" : "nárcisz", "category" : "egyéves"},
    {"name" : "rózsa", "category" : "egyéves"},
    {"name" : "tulipán", "category" : "egyéves"}
]

const trees = [
    {"name" : "tölgy", "category" : "lombhullató"},
    {"name" : "fűz", "category" : "lombhullató"},
    {"name" : "fenyő", "category" : "örökzöld"}
]

app.get('/', (req, res) => {
    res.sendFile('./views/index.html', {root: __dirname});
});

app.get('/flowers', (req, res) => {
    res.send(flowers)
})

app.get('/trees', (req, res) => {
    res.send(trees)
})

app.use((req, res) => {
    res.status(404).sendFile("./views/404.html", { root: __dirname });
});

app.get('/plants/:param', (req, res) => {
    const param = req.params.param
    switch(param){
        case "flowers":
            res.send(flowers);
            break;
        case "trees":
            res.send(trees);
            break;
        default:
            res.status(404).sendFile("./views/404.html", {root : __dirname});
            break;
    }
});

app.listen(3010, () => {
    console.log('Server runs on port 3010');
});