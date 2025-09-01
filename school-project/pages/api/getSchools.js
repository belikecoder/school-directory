import { createConnection } from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const connection = await createConnection({
  port:process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

    // Updated query to also fetch the `board` column
    const [rows] = await connection.execute('SELECT name, states, city, image, board FROM schools');
    await connection.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ message: 'Failed to fetch schools.' });
  }
}
