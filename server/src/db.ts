import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.NODE_ENV === 'production' 
    ? path.join('/app/database', 'prompts.db') 
    : path.join(__dirname, '..' ,'database', 'prompts.db');


export function initDatabase() {
    // Ensure the directory exists.
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const db = new Database(dbPath, { verbose: console.log });

    const createTable = `
        CREATE TABLE IF NOT EXISTS prompts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prompt_id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            template TEXT NOT NULL
        );
    `;

    db.exec(createTable);
    console.log('Database initialized and prompts table is ready.');
    return db;
}
