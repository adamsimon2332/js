import express from 'express'
import { dbAll, dbInit } from './util/database.js'

const app = express()
app.use(express.json())

app.get('/roxfort', async (req, res) => {
    const roxfort = await dbAll('SELECT * FROM roxfort')
    res.status(200).json(roxfort)
})

app.get('/roxfort/:id', async (req, res) => {
    const roxfortStudent = await dbGet('SELECT * FROM roxfort WHERE id = ?', [req.params.id])
    if (!roxfortStudent) {
        res.status(404).json({message: 'Roxfort student not found'})
    }
    res.status(200).json(roxfortStudent)
})

app.post('/roxfort', async (req, res) => {
    const {name, magicWand, house} = req.body
    if (!name || !magicWand || !house) {
        return res.status(404).json({message: 'Roxfort student not found'})
    }
    const result = await dbRun('INSERT INTO roxfort (name, magicWand, house) VALUES (?, ?, ?)', [name, magicWand, house])
    res.status(201).json({id: result.lastID, name, magicWand, house})
})

app.put('/roxfort/:id', async (req, res) => {
    const id = req.params.id
    const roxfortStudent = await dbGet('SELECT * FROM roxfort WHERE id = ?', [id])
    if (!roxfortStudent) {
        return res.status(404).json({message: 'Roxfort student not found'})
    }
    const {name, magicWand, house} = req.body
    if (!name || !magicWand || !house) {
        return res.status(400).json({message: 'Name, magic wand and house are required'})
    }
    dbRun("UPDATE roxfort SET name = ?, magicWand = ?, house = ? WHERE id = ?", [name, magicWand, house, id])
    res.status(200).json({id, name, magicWand, house})
})

app.delete('/roxfort/:id', async (req, res) => {
    const roxfortStudent = await dbGet('SELECT * FROM roxfort WHERE id = ?', [req.params.id])
    if (!roxfortStudent) {
        return res.status(404).json({message: 'Roxfort student not found'})
    }
    dbRun('DELETE FROM roxfort WHERE id = ?', [req.params.id])
    res.status(200).json({message: 'Roxfort student deleted'})
})

app.use((req, res, next, err) => {
    if (err) {
        res.status(500).json({message: `Error: ${err.message}`})
    }
})

async function startServer() {
    await dbInit()
    app.listen(3000, () => {
        console.log('Server runs on port 3000')
    })
}

startServer()