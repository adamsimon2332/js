import express from 'express'
import { dbAll, dbInit } from './util/database.js'

const app = express()
app.use(express.json())

app.get('/users', async (req, res) => {
    const users = await dbAll('SELECT * FROM users')
    res.status(200).json(users)
})

app.get('/users/:id', async (req, res) => {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [req.params.id])
    if (!user) {
        res.status(404).json({message: 'User not found'})
    }
    res.status(200).json(user)
})

app.post('/users', async (req, res) => {
    const {name, age} = req.body
    if (!name || !age) {
        return res.status(404).json({message: 'User not found'})
    }
    const result = await dbRun('INSERT INTO users (name, age) VALUES (?, ?)', [name, age])
    res.status(201).json({id: result.lastID, name, age})
})

app.put('/users/:id', async (req, res) => {
    const id = req.params.id
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [id])
    if (!user) {
        return res.status(404).json({message: 'User not found'})
    }
    const {name, age} = req.body
    if (!name || !age) {
        return res.status(400).json({message: 'Name and age are required'})
    }
    dbRun("UPDATE users SET name = ?, age = ? WHERE id = ?", [name, age, id])
    res.status(200).json({id, name, age})
})

app.delete('/users/:id', async (req, res) => {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [req.params.id])
    if (!user) {
        return res.status(404).json({message: 'User not found'})
    }
    dbRun('DELETE FROM users WHERE id = ?', [req.params.id])
    res.status(200).json({message: 'User deleted'})
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