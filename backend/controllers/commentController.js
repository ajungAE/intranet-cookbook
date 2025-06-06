/**
 * @module controllers/commentController
 * @description Controller für das Kommentarsystem (CRUD für Kommentare)
 */
import db from '../config/db.js';

/**
 * Fügt einen neuen Kommentar zu einem Rezept hinzu.
 * 
 * @route POST /comments/:recipeId
 * @async
 * @function
 * @param {Request} req - Enthält Kommentartext und Nutzerinfo
 * @param {Response} res - Gibt erstellten Kommentar mit Usernamen zurück
 * @returns {Response} JSON mit Kommentar oder Fehlermeldung
 */
export const addComment = async (req, res) => {
  const { text } = req.body;
  const userId = req.user.id;
  const recipeId = req.params.recipeId;

  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const conn = await db.getConnection();

    // Kommentar einfügen
    const result = await conn.query(
      "INSERT INTO comments (recipe_id, user_id, text) VALUES (?, ?, ?)",
      [recipeId, userId, text]
    );

    // Kommentar mit zusätzlichen Infos (JOIN)
    const [comment] = await conn.query(
      `SELECT comments.id, comments.text, comments.created_at, comments.user_id, user.username 
       FROM comments 
       JOIN user ON comments.user_id = user.id 
       WHERE comments.id = ?`,
      [result.insertId]
    );

    conn.end();

    res.status(201).json(comment);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add comment", error: err.message });
  }
};


/**
 * Gibt alle Kommentare zu einem bestimmten Rezept zurück.
 * 
 * @route GET /comments/:recipeId
 * @async
 * @function
 * @param {Request} req - Enthält Rezept-ID
 * @param {Response} res - Liste von Kommentaren
 * @returns {Response} JSON-Array mit Kommentaren
 */
export const getCommentsByRecipe = async (req, res) => {
  const recipeId = req.params.recipeId;

  try {
    const conn = await db.getConnection();
    const comments = await conn.query(
      `SELECT comments.id, comments.text, comments.created_at, comments.user_id, user.username 
       FROM comments 
       JOIN user ON comments.user_id = user.id 
       WHERE comments.recipe_id = ? 
       ORDER BY comments.created_at DESC`,
      [recipeId]
    );
    conn.end();
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments', error: err.message });
  }
};


/**
 * Löscht einen Kommentar (nur durch Ersteller möglich).
 * 
 * @route DELETE /comments/:commentId
 * @async
 * @function
 * @param {Request} req - Enthält Kommentar-ID und Nutzerinfo
 * @param {Response} res - Erfolgs- oder Fehlermeldung
 * @returns {Response}
 */
export const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user.id;

  try {
    const conn = await db.getConnection();
    const [comment] = await conn.query(
      'SELECT user_id FROM comments WHERE id = ?',
      [commentId]
    );

    if (!comment || comment.user_id !== userId) {
      conn.end();
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await conn.query('DELETE FROM comments WHERE id = ?', [commentId]);
    conn.end();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment', error: err.message });
  }
};

/**
 * Bearbeitet einen bestehenden Kommentar (nur durch Ersteller möglich).
 * 
 * @route PATCH /comments/:commentId
 * @async
 * @function
 * @param {Request} req - Enthält neuen Kommentartext
 * @param {Response} res - Erfolgs- oder Fehlermeldung
 * @returns {Response}
 */
export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  if (!text) {
    return res.status(400).json({ message: 'Kommentartext darf nicht leer sein' });
  }

  try {
    const conn = await db.getConnection();
    const [comment] = await conn.query('SELECT * FROM comments WHERE id = ?', [commentId]);

    if (!comment || comment.user_id !== userId) {
      conn.end();
      return res.status(403).json({ message: 'Keine Berechtigung zum Bearbeiten' });
    }

    await conn.query('UPDATE comments SET text = ? WHERE id = ?', [text, commentId]);
    conn.end();

    res.status(200).json({ message: 'Kommentar aktualisiert' });
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Aktualisieren', error: err.message });
  }
};
