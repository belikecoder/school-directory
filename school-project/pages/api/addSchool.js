import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { createConnection } from 'mysql2/promise';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Define the upload directory
  const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');

  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    multiples: false,
  });

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });

    // Check required fields
    const requiredFields = ['name', 'address', 'city', 'states', 'contact', 'email_id', 'board'];
    for (const field of requiredFields) {
      if (!fields[field] || fields[field][0] === '') {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    if (!files.image || files.image.length === 0) {
      return res.status(400).json({ message: 'Missing required file: image' });
    }

    const file = files.image[0];
    const oldPath = file.filepath;

    // Final public path to be saved in DB
    const imageFileName = file.newFilename;
    const newImagePath = path.join(uploadDir, imageFileName);
    const imageUrl = `/schoolImages/${imageFileName}`; // Relative path for frontend

    // Move file from tmp to public/schoolImages
    fs.renameSync(oldPath, newImagePath);

    // MySQL insert
    const connection = await createConnection({
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const query = `
      INSERT INTO schools (name, address, city, states, contact, image, email_id, board)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      fields.name[0],
      fields.address[0],
      fields.city[0],
      fields.states[0],
      Number(fields.contact[0]),
      imageUrl,
      fields.email_id[0],
      fields.board[0],
    ];

    await connection.execute(query, values);
    await connection.end();

    res.status(200).json({ message: 'School added successfully!' });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({ message: 'Failed to add school.' });
  }
}
