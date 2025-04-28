import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Import routes
import apiRoutes from './routes/api.js';

// Import models
import * as albumModel from './models/albums.js';

// Setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create application
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Setup API routes
app.use('/api', apiRoutes);

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize database and start server
async function startServer() {
  try {
    await albumModel.initializeDatabase();
    app.listen(port, () => {
      console.log(`Album manager app listening at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();