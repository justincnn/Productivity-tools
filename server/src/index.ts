
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { adminRouter } from './routes/admin';
import { publicRouter } from './routes/public';
import { initDatabase } from './db';

// For local development, load .env file
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Initialize database
const db = initDatabase();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Ensure the database directory exists
const dbDir = path.join(__dirname, '..', 'database');
const fs = require('fs');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}


// --- Routes ---
app.use('/api', publicRouter(db));
app.use('/api/admin', adminRouter(db));

// --- Server Start ---
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
