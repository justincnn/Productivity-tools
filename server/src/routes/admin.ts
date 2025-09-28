import express from 'express';
import jwt from 'jsonwebtoken';
import { Database } from 'better-sqlite3';
import crypto from 'crypto';

// Middleware for JWT authentication
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    const adminApiKey = process.env.ADMIN_API_KEY;

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing.' });
    }

    try {
        jwt.verify(token, adminApiKey!);
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

export function adminRouter(db: Database) {
    const router = express.Router();

    // Admin Login
    router.post('/login', (req, res) => {
        const { password } = req.body;
        const adminApiKey = process.env.ADMIN_API_KEY;

        if (!adminApiKey) {
            return res.status(500).json({ message: 'Admin API key is not configured on the server.' });
        }

        if (password === adminApiKey) {
            const token = jwt.sign({ role: 'admin' }, adminApiKey, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Incorrect password.' });
        }
    });

    // --- Protected Prompt Routes ---

    router.get('/prompts', authMiddleware, (req, res) => {
        try {
            const stmt = db.prepare('SELECT * FROM prompts ORDER BY id DESC');
            const prompts = stmt.all();
            res.json(prompts);
        } catch (error) {
            res.status(500).json({ message: 'Failed to retrieve prompts.', error });
        }
    });

    router.post('/prompts', authMiddleware, (req, res) => {
        const { name, template } = req.body;
        if (!name || !template) {
            return res.status(400).json({ message: 'Name and template are required.' });
        }
        const prompt_id = crypto.randomBytes(8).toString('hex');

        try {
            const stmt = db.prepare('INSERT INTO prompts (prompt_id, name, template) VALUES (?, ?, ?)');
            const info = stmt.run(prompt_id, name, template);
            res.status(201).json({ id: info.lastInsertRowid, prompt_id, name, template });
        } catch (error) {
            res.status(500).json({ message: 'Failed to create prompt.', error });
        }
    });

    router.put('/prompts/:id', authMiddleware, (req, res) => {
        const { id } = req.params;
        const { name, template } = req.body;
        if (!name || !template) {
            return res.status(400).json({ message: 'Name and template are required.' });
        }

        try {
            const stmt = db.prepare('UPDATE prompts SET name = ?, template = ? WHERE id = ?');
            const info = stmt.run(name, template, id);
            if (info.changes === 0) {
                return res.status(404).json({ message: `Prompt with id ${id} not found.` });
            }
            res.json({ id, name, template });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update prompt.', error });
        }
    });

    router.delete('/prompts/:id', authMiddleware, (req, res) => {
        const { id } = req.params;
        try {
            const stmt = db.prepare('DELETE FROM prompts WHERE id = ?');
            const info = stmt.run(id);
            if (info.changes === 0) {
                return res.status(404).json({ message: `Prompt with id ${id} not found.` });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete prompt.', error });
        }
    });

    return router;
}
