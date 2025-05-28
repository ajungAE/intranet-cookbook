import db from '../config/db.js';

// GET /categories
export const getAllCategories = async (req, res) => {
  try {
    const conn = await db.getConnection();
    const categories = await conn.query('SELECT * FROM category');
    conn.end();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
  }
};

// POST /categories
export const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const conn = await db.getConnection();
    await conn.query('INSERT INTO category (name) VALUES (?)', [name]);
    conn.end();
    res.status(201).json({ message: 'Category created' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Category already exists' });
    }
    res.status(500).json({ message: 'Failed to create category', error: err.message });
  }
};

// POST /categories/assign/:recipeId
export const assignCategoryToRecipe = async (req, res) => {
  const { categoryId } = req.body;
  const recipeId = req.params.recipeId;
  const userId = req.user.id;

  if (!categoryId) return res.status(400).json({ message: 'Category ID is required' });

  try {
    const conn = await db.getConnection();
    const [recipe] = await conn.query('SELECT user_id FROM recipe WHERE id = ?', [recipeId]);

    if (!recipe || recipe.user_id !== userId) {
      conn.end();
      return res.status(403).json({ message: 'Not authorized to modify this recipe' });
    }

    await conn.query(
      'INSERT INTO recipe_category (recipe_id, category_id) VALUES (?, ?)',
      [recipeId, categoryId]
    );

    conn.end();
    res.status(200).json({ message: 'Category assigned to recipe' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign category', error: err.message });
  }
};
