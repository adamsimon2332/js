import express from "express";
import __dirname from "./util/rootpath.js"

const app = express();
app.use(express.json())

const products = [
    { name: "Laptop", category: "Electronics", price: 1000, available: true },
    { name: "Smartphone", category: "Electronics", price: 800, available: true },
    { name: "Desk Chair", category: "Furniture", price: 150, available: false },
    { name: "Coffee Table", category: "Furniture", price: 200, available: true },
    { name: "Headphones", category: "Electronics", price: 100, available: true },
    { name: "Notebook", category: "Stationery", price: 5, available: true }
];

app.get('/products', (req, res) => {
    res.send(products)
})

app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (id >= 0 && id < products.length) {
      res.json(products[id]);
    } else {
      res.json({});
    }
  });
  
app.post('/products', (req, res) => {
    const { name, category, price, available } = req.body;
    if (name && category && price && available) {
        products.push({ name, category, price, available });
        res.status(201).json({ name, category, price, available });
    } else {
        res.status(400).json({ message: "Invalid product data" });
    }
});

app.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name, category, price, available } = req.body;

    if (name && category && price && available) {
        if (id >= 0 && id < products.length) {
            products[id] = { name, category, price, available };
            res.json(products[id]);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } else {
        res.status(400).json({ message: "Invalid product data" });
    }
});

app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (id >= 0 && id < products.length) {
        products.splice(id, 1);
        res.json({ message: "Delete successful" });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

app.listen(3010, () => {
    console.log('Server runs on port 3010');
});