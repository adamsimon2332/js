import express from 'express';
import * as timetableModel from '../models/timetable.js';

const router = express.Router();

timetableModel.initializeDatabase();

router.get('/entries', async (req, res) => {
  try {
    const entries = await timetableModel.getAllEntries();
    res.json(entries);
  } catch (error) {
    console.error('Hiba az órák lekérdezésénél:', error);
    res.status(500).json({ error: 'Hiba az órák lekérdezésénél' });
  }
});

router.get('/entries/day/:day', async (req, res) => {
  try {
    const entries = await timetableModel.getEntriesByDay(req.params.day);
    res.json(entries);
  } catch (error) {
    console.error('Hiba az órák lekérdezésénél naponként:', error);
    res.status(500).json({ error: 'Hiba az órák lekérdezésénél naponként' });
  }
});

router.get('/days', async (req, res) => {
  try {
    const days = await timetableModel.getDays();
    res.json(days);
  } catch (error) {
    console.error('Hiba a napok lekérdezésénél:', error);
    res.status(500).json({ error: 'Hiba a napok lekérdezésénél' });
  }
});

router.post('/entries', async (req, res) => {
  try {
    const { day, hour, subject, teacher, room } = req.body;
    
    if (!day || !hour || !subject) {
      return res.status(400).json({ error: 'Nap, óra és tantárgy kötelező' });
    }
    
    const newEntry = await timetableModel.addEntry({ day, hour, subject, teacher, room });
    if (!newEntry) {
      return res.status(500).json({ error: 'Hiba az új óra hozzáadásánál' });
    }
    
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Hiba új óra hozzáadásánál:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/entries/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { day, hour, subject, teacher, room } = req.body;
    
    const updatedEntry = await timetableModel.updateEntry(id, { day, hour, subject, teacher, room });
    
    if (!updatedEntry) {
      return res.status(404).json({ error: 'Az óra nem található' });
    }
    
    res.json(updatedEntry);
  } catch (error) {
    console.error('Hiba az óra frissítésénél:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/entries/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await timetableModel.deleteEntry(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Az óra nem található' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Hiba az óra törlésénél:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;