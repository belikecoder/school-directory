import { IncomingForm } from 'formidable-serverless';
import { v2 as cloudinary } from 'cloudinary';
import { createConnection } from 'mysql2/promise';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = new IncomingForm();

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });

    // Ensure all fields and the image file are present
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

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'schoolImages',
    });

    const imageUrl = result.secure_url;

    // Connect to MySQL and insert data
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
