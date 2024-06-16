import express from 'express';
import { startDB, getDB } from './db.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/api/flavors', async (req, res) => {
    const client = getDB();
    const result = await client.query('SELECT * FROM flavors');
    res.json(result.rows);
});

app.get('/api/flavors/:id', async (req, res) => {
    const client = getDB();
    const { id } = req.params;
    const result = await client.query('SELECT * FROM flavors WHERE id = $1', [id]);
    res.json(result.rows[0]);
});

app.post('/api/flavors', async (req, res) => {
    const client = getDB();
    const { name, is_favorite } = req.body;
    const result = await client.query(
        'INSERT INTO flavors (name, is_favorite) VALUES ($1, $2) RETURNING *',
        [name, is_favorite]
    );
    res.json(result.rows[0]);
});

app.delete('/api/flavors/:id', async (req, res) => {
    const client = getDB();
    const { id } = req.params;
    await client.query('DELETE FROM flavors WHERE id = $1', [id]);
    res.sendStatus(204);
});

app.put('/api/flavors/:id', async (req, res) => {
    const client = getDB();
    const { id } = req.params;
    const { name, is_favorite } = req.body;
    const result = await client.query(
        'UPDATE flavors SET name = $1, is_favorite = $2, updated_at = now() WHERE id = $3 RETURNING *',
        [name, is_favorite, id]
    );
    res.json(result.rows[0]);
});

const startApp = async () => {
    try {
        await startDB(true);
        app.listen(PORT, () => {
            console.log(`Server is now listening to PORT ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the application:', error);
    }
};

startApp();
