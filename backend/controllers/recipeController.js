import db from '../config/db.js';

// POST /recipes
export const createRecipe = async (req, res) => {
  const imagePath = req.file ? req.file.path : null;
  const { title, ingredients, instructions } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const conn = await db.getConnection();
    const result = await conn.query(
      'INSERT INTO recipe (title, ingredients, instructions, user_id, image_path) VALUES (?, ?, ?, ?, ?)',
      [title, ingredients, instructions, req.user.id, imagePath]
    );
    conn.end();

    res.status(201).json({
      message: 'Recipe created successfully',
      recipeId: Number(result.insertId)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create recipe', error: err.message });
  }
};

// GET /recipes
export const getAllRecipes = async (req, res) => {
  try {
    const conn = await db.getConnection();
    const recipes = await conn.query(
      'SELECT id, title, ingredients, instructions, image_path, created_at FROM recipe ORDER BY created_at DESC'
    );
    conn.end();

    res.status(200).json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch recipes', error: err.message });
  }
};

// GET /recipes/:id
export const getRecipeById = async (req, res) => {
  const recipeId = req.params.id;

  try {
    const conn = await db.getConnection();
    const result = await conn.query(
      'SELECT id, title, ingredients, instructions, image_path, created_at FROM recipe WHERE id = ?',
      [recipeId]
    );
    conn.end();

    if (result.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(result[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch recipe', error: err.message });
  }
};

// DELETE /recipes/:id
export const deleteRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user.id;

  try {
    const conn = await db.getConnection();
    const result = await conn.query(
      'SELECT user_id FROM recipe WHERE id = ?',
      [recipeId]
    );

    if (result.length === 0) {
      conn.end();
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const recipe = result[0];

    if (recipe.user_id !== userId) {
      conn.end();
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await conn.query('DELETE FROM recipe WHERE id = ?', [recipeId]);
    conn.end();

    res.status(200).json({ message: 'Recipe deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete recipe', error: err.message });
  }
};
