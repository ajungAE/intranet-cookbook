import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5
});

// So kannst du später `db.getConnection()` und `db.end()` verwenden
const db = {
  getConnection: () => pool.getConnection(),
  end: () => pool.end()
};

export default db;
