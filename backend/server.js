// Core imports
import https from 'https';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Custom modules
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import commentRoutes from './routes/commentRoutes.js';


// Load .env
dotenv.config();

// Express setup
const app = express();

// Port (Standard auf 3443 ändern für HTTPS)
const PORT = process.env.PORT || 3443;
const HOSTNAME = 'ajubuntu';

// Middleware
app.use(cors({
  origin: 'https://ajubuntu:5173',
  credentials: true
}));
app.use(express.json());

// Statische Datei-Auslieferung
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://ajubuntu:5173');
  next();
}, express.static('uploads'));

// API Routes
app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);
app.use('/categories', categoryRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/comments', commentRoutes);

// DB connection test
db.getConnection()
  .then(conn => {
    console.log('Connected to MariaDB');
    conn.end();
  })
  .catch(err => {
    console.error('DB connection failed:', err);
  });

// SSL Zertifikat laden
const sslOptions = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem'),
};

// Nur starten, wenn nicht im Test-Modus
if (process.env.NODE_ENV !== 'test') {
  const httpsServer = https.createServer(sslOptions, app);
  httpsServer.listen(PORT, () => {
    console.log(`HTTPS-Server läuft unter https://${HOSTNAME}:${PORT}`);
    db.getConnection().then(conn => {
      console.log('Connected to MariaDB');
      conn.end();
    }).catch(err => console.error('DB connection failed:', err));
  });
}

// Export für Tests
export { app };
