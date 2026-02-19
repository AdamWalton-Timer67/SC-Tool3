import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: process.env.MARIADB_HOST,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
    connectionLimit: Number(process.env.MARIADB_CONNECTION_LIMIT),
    ssl: false
});

export const load = async () => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM entries ORDER BY created_at DESC');
        conn.release();

        return {
            entries: rows,
            status: 'ok'
        };
    } catch (err) {
        console.error('DB error:', err);
        return {
            entries: [],
            status: 'error'
        };
    }
};
