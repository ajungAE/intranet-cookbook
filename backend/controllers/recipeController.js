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

