import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './authRoutes.js';
import todoRoutes from './todoRoutes.js';
import authMiddleware from './authMiddleware.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5003;

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(cors());

// Serve static frontend from /public
app.use(express.static(path.join(__dirname, 'public')));

// Frontend entrypoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.use('/auth', authRoutes);
app.use('/todos', authMiddleware, todoRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
