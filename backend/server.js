// 1. Core imports
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 2. Custom modules
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';  


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
app.use('/recipes', recipeRoutes);
app.use('/categories', categoryRoutes); 
app.get('/', (req, res) => {
  res.send('API is running');
});

// 7. DB connection test (optional: nur für dev/debug)
db.getConnection()
  .then(conn => {
    console.log('Connected to MariaDB');
    conn.end();
  })
  .catch(err => {
    console.error('DB connection failed:', err);
  });

// 8. Server listen
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
