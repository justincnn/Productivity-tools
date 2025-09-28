import express from 'express';
import OpenAI from 'openai';
import { Database } from 'better-sqlite3';

export function publicRouter(db: Database) {
    const router = express.Router();

    const getOpenaiClient = (req: express.Request) => {
        const apiKey = process.env.OPENAI_API_KEY;
        const baseURL = process.env.OPENAI_API_BASE_URL;

        if (!apiKey || !baseURL) {
            throw new Error('OpenAI API key or base URL is not configured.');
        }

        return new OpenAI({
            apiKey: apiKey,
            baseURL: baseURL,
        });
    };

    router.get('/models', async (req, res) => {
        try {
            const openai = getOpenaiClient(req);
            const models = await openai.models.list();
            res.json(models.data);
        } catch (error) { 
            console.error('Error fetching models:', error);
            res.status(500).json({ error: 'Failed to fetch models from OpenAI.' });
        }
    });

    router.post('/generate', async (req, res) => {
        const { model, messages } = req.body;

        if (!model || !messages) {
            return res.status(400).json({ error: 'Model and messages are required.' });
        }

        try {
            const openai = getOpenaiClient(req);
            const stream = await openai.chat.completions.create({
                model: model,
                messages: messages,
                stream: true,
            });

            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }

            res.end();

        } catch (error) {
            console.error('Error generating completion:', error);
            res.status(500).json({ error: 'Failed to generate completion.' });
        }
    });

    return router;
}
