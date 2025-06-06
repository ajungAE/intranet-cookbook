/**
 * @module controllers/favoriteController
 * @description Controller-Funktionen für Favoriten-Funktionalität
 */
import db from '../config/db.js';

/**
 * Fügt ein Rezept zu den Favoriten des aktuellen Nutzers hinzu.
 * 
 * @route POST /favorites/:recipeId
 * @async
 * @function
 * @param {Request} req - Express-Request (enthält user und recipeId)
 * @param {Response} res - JSON-Antwort mit Status
 * @returns {Response} Erfolg oder Fehlermeldung
 */
export const addFavorite = async (req, res) => {
  const userId = req.user.id;
  const recipeId = req.params.recipeId;

  try {
    const conn = await db.getConnection();
    await conn.query(
      'INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)',
      [userId, recipeId]
    );
    conn.end();
    res.status(200).json({ message: 'Recipe added to favorites' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Already in favorites' });
    }
    res.status(500).json({ message: 'Failed to add favorite', error: err.message });
  }
};

/**
 * Entfernt ein Rezept aus den Favoriten des aktuellen Nutzers.
 * 
 * @route DELETE /favorites/:recipeId
 * @async
 * @function
 * @param {Request} req - Express-Request (enthält user und recipeId)
 * @param {Response} res - JSON-Antwort mit Status
 * @returns {Response} Erfolg oder Fehlermeldung
 */
export const removeFavorite = async (req, res) => {
  const userId = req.user.id;
  const recipeId = req.params.recipeId;

  try {
    const conn = await db.getConnection();
    await conn.query(
      'DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?',
      [userId, recipeId]
    );
    conn.end();
    res.status(200).json({ message: 'Recipe removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove favorite', error: err.message });
  }
};


/**
 * Gibt alle Lieblingsrezepte des eingeloggten Nutzers zurück.
 * 
 * @route GET /favorites/me
 * @async
 * @function
 * @param {Request} req - Express-Request mit Nutzerinformation
 * @param {Response} res - JSON-Array der Favoriten
 * @returns {Response} Liste von Rezepten
 */
export const getFavoritesForUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const conn = await db.getConnection();
    const result = await conn.query(
      `SELECT recipe.* 
       FROM recipe 
       JOIN favorites ON recipe.id = favorites.recipe_id 
       WHERE favorites.user_id = ? 
       ORDER BY favorites.recipe_id DESC`,
      [userId]
    );
    conn.end();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch favorites', error: err.message });
  }
};
