// 1. Core imports
import https from 'https';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 2. Custom modules
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import commentRoutes from './routes/commentRoutes.js';


// 3. Load .env
dotenv.config();

// 4. Express setup
const app = express();
const PORT = process.env.PORT || 3000;

// 5. Middleware
app.use(cors());
app.use(express.json());

// 6. Routes
app.use('/auth', authRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/recipes', recipeRoutes);
app.use('/categories', categoryRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/comments', commentRoutes);

// 7. DB connection test (optional: nur für dev/debug)
db.getConnection()
  .then(conn => {
    console.log('Connected to MariaDB');
    conn.end();
  })
  .catch(err => {
    console.error('DB connection failed:', err);
  });

// Zertifikat laden
const sslOptions = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem'),
};

// HTTPS-Server starten
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`HTTPS-Server läuft unter https://localhost:${PORT}`);
});