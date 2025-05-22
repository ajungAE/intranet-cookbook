import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import db from './config/db.js';

db.getConnection()
  .then(conn => {
    console.log(' Connected to MariaDB');
    conn.end();
  })
  .catch(err => {
    console.error(' DB connection failed:', err);
  });
