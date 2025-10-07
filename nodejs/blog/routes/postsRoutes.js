import express from 'express';
import * as db from '../data/db.js';

const router = express.Router();

router.get('/', (req, res) => {
    const posts = db.getPosts();
    res.json(posts);
});

router.get('/:id', (req, res) => {
    const post = db.getPostById(req.params.id);
    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
});

router.post('/', (req, res) => {
    const { userId, title, content } = req.body;
    if (!userId || !title || !content) {
        return res.status(400).json({ error: "User ID, title, and content are required" });
    }
    const saved = db.savePost(userId, title, content);
    res.status(201).json({ success: true, postId: saved.lastInsertRowid });
});

router.put('/:id', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
    }
    const updated = db.updatePost(req.params.id, title, content);
    if (updated.changes === 0) {
        return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ success: true, message: "Post updated successfully" });
});

router.delete('/:id', (req, res) => {
    const deleted = db.deletePost(req.params.id);
    if (deleted.changes === 0) {
        return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ success: true, message: "Post deleted successfully" });
});

export default router;