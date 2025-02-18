import express from "express";
import __dirname from "./util/rootpath.js"

const app = express();
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello');
});

app.get('/index', (req, res) => {
    res.sendFile('./views/index.html', {root: __dirname});
});

app.get('/:parameter', (req, res) => {
    const param = req.params.parameter;
    console.log(param);
    res.send(param);
});

app.post("/", (req, res) => {
    // const name = req.body.name;
    // const age = req.body.age;
    const {name, age} = req.body;
    console.log(`Name: ${name} age: ${age}`);
    res.json({name, age})
})

app.listen(3000, () => {
    console.log('Server runs on port 3000');
});