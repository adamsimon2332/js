import express from 'express';
import bcrypt from 'bcrypt';
import * as db from '../data/db.js';

const router = express.Router();

router.get('/', (req, res) => {
    const users = db.getUsers();
    res.json(users);
});

router.get('/:id', (req, res) => {
    const user = db.getUserById(req.params.id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
});

router.post('/', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const saved = db.saveUser(name, email, hashedPassword);
    res.status(201).json({ success: true, userId: saved.lastInsertRowid });
});

router.put('/:id', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const updated = db.updateUser(req.params.id, name, email, hashedPassword);
    if (updated.changes === 0) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ success: true, message: "User updated successfully" });
});

router.delete('/:id', (req, res) => {
    const deleted = db.deleteUser(req.params.id);
    if (deleted.changes === 0) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
});

export default router;