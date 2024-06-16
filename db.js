import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/acme_IceCream';

let client = null;

export const getDB = () => {
    if (!client) {
        console.log('Cannot access db before it is started');
        throw new Error('Database client is not initialized');
    }
    return client;
};

export const seedDB = async () => {
    if (!client) {
        console.log('Cannot read db if not connected');
        return;
    }
    try {
        await client.query(`
            DROP TABLE IF EXISTS flavors;
            CREATE TABLE IF NOT EXISTS flavors (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                is_favorite BOOL,
                created_at TIMESTAMP DEFAULT now(),
                updated_at TIMESTAMP DEFAULT now()
            );
            INSERT INTO flavors (name, is_favorite)
            VALUES 
                ('Chocolate', true),
                ('Strawberry', false),
                ('Vanilla', true);
        `);
        console.log('Successfully seeded db');
    } catch (e) {
        console.log('Failed to seed db');
        console.error(e);
    }
};

export const startDB = async () => {
    try {
        client = new Client({ connectionString: DATABASE_URL });
        await client.connect();
        await seedDB();
        return client;
    } catch (e) {
        console.error('Failed to connect to the database:', e);
        throw e;
    }
};
