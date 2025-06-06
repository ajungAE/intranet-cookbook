/**
 * Authentifizierungscontroller für Registrierung und Login
 * @module controllers/authController
 */
import bcrypt from "bcryptjs";
import db from "../config/db.js";
import jwt from 'jsonwebtoken';

/**
 * Registriert einen neuen Benutzer.
 * 
 * @route POST /auth/register
 * @param {Request} req - Express-Request-Objekt
 * @param {Response} res - Express-Response-Objekt
 * @returns {Response} Erfolgs- oder Fehlermeldung
 */
export const registerUser = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await db.getConnection();
    const result = await conn.query(
      "INSERT INTO user (email, password, username) VALUES (?, ?, ?)",
      [email, hashedPassword, username || null]
    );
    conn.end();

    res.status(201).json({
      message: "User registered successfully",
      userId: Number(result.insertId), 
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already exists" });
    }

    console.error(err);
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

/**
 * Loggt einen Benutzer ein.
 * 
 * @route POST /auth/login
 * @param {Request} req - Express-Request-Objekt
 * @param {Response} res - Express-Response-Objekt
 * @returns {Response} JWT-Token bei Erfolg oder Fehlermeldung
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const conn = await db.getConnection();
    const rows = await conn.query('SELECT * FROM user WHERE email = ?', [email]);
    conn.end();

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
