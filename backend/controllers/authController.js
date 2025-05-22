import bcrypt from "bcryptjs";
import db from "../config/db.js";

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
