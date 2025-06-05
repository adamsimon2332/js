import express from 'express';
import * as blogModel from '../models/blog.js';

const router = express.Router();

router.get('/users', (req, res) => {
    try {
        const users = blogModel.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/users/:id', (req, res) => {
    try {
        const user = blogModel.getUser(parseInt(req.params.id));
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/users', (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        const result = blogModel.createUser(name, email);
        res.status(201).json({ id: result.lastInsertRowid, name, email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/users/:id', (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        const result = blogModel.updateUser(parseInt(req.params.id), name, email);
        if (result.changes > 0) {
            res.json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/users/:id', (req, res) => {
    try {
        const result = blogModel.removeUser(parseInt(req.params.id));
        if (result.changes > 0) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/blogs', (req, res) => {
    try {
        const blogs = blogModel.getBlogs();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/blogs/:id', (req, res) => {
    try {
        const blog = blogModel.getBlog(parseInt(req.params.id));
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ error: 'Blog post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/blogs', (req, res) => {
    try {
        const { author_id, title, category, content } = req.body;
        if (!author_id || !title || !category || !content) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const result = blogModel.createBlog(author_id, title, category, content);
        res.status(201).json({ 
            id: result.lastInsertRowid, 
            author_id, 
            title, 
            category, 
            content 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/blogs/:id', (req, res) => {
    try {
        const { title, category, content } = req.body;
        if (!title || !category || !content) {
            return res.status(400).json({ error: 'Title, category, and content are required' });
        }
        const result = blogModel.updateBlog(parseInt(req.params.id), title, category, content);
        if (result.changes > 0) {
            res.json({ message: 'Blog post updated successfully' });
        } else {
            res.status(404).json({ error: 'Blog post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/blogs/:id', (req, res) => {
    try {
        const result = blogModel.removeBlog(parseInt(req.params.id));
        if (result.changes > 0) {
            res.json({ message: 'Blog post deleted successfully' });
        } else {
            res.status(404).json({ error: 'Blog post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
