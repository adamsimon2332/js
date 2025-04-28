// API routes for album management
import express from 'express';
import * as albumModel from '../models/albums.js';

const router = express.Router();

// Get all albums
router.get('/albums', async (req, res) => {
  try {
    const albums = await albumModel.getAllAlbums();
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single album
router.get('/albums/:id', async (req, res) => {
  try {
    const album = await albumModel.getAlbumById(req.params.id);
    res.json(album);
  } catch (err) {
    if (err.message === 'Album not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Create a new album
router.post('/albums', async (req, res) => {
  const { band, title, releaseYear, genre } = req.body;
  
  if (!band || !title) {
    return res.status(400).json({ error: 'Band and title are required' });
  }

  try {
    const newAlbum = await albumModel.createAlbum({ band, title, releaseYear, genre });
    res.status(201).json(newAlbum);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an album
router.put('/albums/:id', async (req, res) => {
  const { band, title, releaseYear, genre } = req.body;
  
  if (!band || !title) {
    return res.status(400).json({ error: 'Band and title are required' });
  }

  try {
    const album = await albumModel.updateAlbum(req.params.id, { band, title, releaseYear, genre });
    res.json(album);
  } catch (err) {
    if (err.message === 'Album not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Delete an album
router.delete('/albums/:id', async (req, res) => {
  try {
    await albumModel.deleteAlbum(req.params.id);
    res.json({ message: 'Album deleted successfully' });
  } catch (err) {
    if (err.message === 'Album not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Get all bands
router.get('/bands', async (req, res) => {
  try {
    const bands = await albumModel.getBands();
    res.json(bands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get albums by band
router.get('/bands/:band/albums', async (req, res) => {
  try {
    const albums = await albumModel.getAlbumsByBand(req.params.band);
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;