import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './authRoutes.js';
import todoRoutes from './todoRoutes.js';
import authMiddleware from './authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Для корректного __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────

app.use(express.json());
app.use(cors());

// ─── ROUTES ──────────────────────────────────────────────────────────────────


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.use('/auth', authRoutes);


app.use('/todos', authMiddleware, todoRoutes);

// ─── ERROR HANDLING ──────────────────────────────────────────────────────────


app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});


app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// ─── START SERVER ────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


