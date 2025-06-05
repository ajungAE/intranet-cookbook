import db from "../config/db.js";

// POST /recipes
export const createRecipe = async (req, res) => {
  const imagePath = req.file ? req.file.filename : null;
  const { title, ingredients, instructions } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const conn = await db.getConnection();
    const result = await conn.query(
      "INSERT INTO recipe (title, ingredients, instructions, user_id, image_path) VALUES (?, ?, ?, ?, ?)",
      [title, ingredients, instructions, req.user.id, imagePath]
    );
    conn.end();

    res.status(201).json({
      message: "Recipe created successfully",
      recipeId: Number(result.insertId),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to create recipe", error: err.message });
  }
};

// GET /recipes
export const getAllRecipes = async (req, res) => {
  try {
    const conn = await db.getConnection();

    const recipes = await conn.query(
      `SELECT r.*, 
              GROUP_CONCAT(c.name) AS categories
       FROM recipe r
       LEFT JOIN recipe_category rc ON r.id = rc.recipe_id
       LEFT JOIN category c ON rc.category_id = c.id
       GROUP BY r.id
       ORDER BY r.created_at DESC`
    );

    conn.end();

    // Optional: Kategorien in Array umwandeln
    const formatted = recipes.map(r => ({
      ...r,
      categories: r.categories ? r.categories.split(',') : []
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch recipes', error: err.message });
  }
};


// GET /recipes/me
export const getMyRecipes = async (req, res) => {
  try {
    console.log("👤 req.user:", req.user); // Debug
    const conn = await db.getConnection();
    const rows = await conn.query("SELECT * FROM recipe WHERE user_id = ?", [
      req.user.id,
    ]);
    conn.end();
    console.log("Gefundene Rezepte:", rows); // Debug
    res.json(rows);
  } catch (err) {
    console.error("Fehler in getMyRecipes:", err);
    res.status(500).json({ message: "Fehler beim Laden deiner Rezepte" });
  }
};

// GET /recipes/:id
export const getRecipeById = async (req, res) => {
  const recipeId = req.params.id;

  try {
    const conn = await db.getConnection();

    const recipeResult = await conn.query(
      `SELECT * FROM recipe WHERE id = ?`, [recipeId]
    );

    if (recipeResult.length === 0) {
      conn.end();
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const catResult = await conn.query(
      `SELECT c.name 
       FROM category c 
       JOIN recipe_category rc ON c.id = rc.category_id
       WHERE rc.recipe_id = ?`, [recipeId]
    );

    conn.end();

    const recipe = {
      ...recipeResult[0],
      categories: catResult.map(c => c.name)
    };

    res.status(200).json(recipe);
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
    const result = await conn.query("SELECT user_id FROM recipe WHERE id = ?", [
      recipeId,
    ]);

    if (result.length === 0) {
      conn.end();
      return res.status(404).json({ message: "Recipe not found" });
    }

    const recipe = result[0];

    if (recipe.user_id !== userId) {
      conn.end();
      return res
        .status(403)
        .json({ message: "Not authorized to delete this recipe" });
    }

    await conn.query("DELETE FROM recipe WHERE id = ?", [recipeId]);
    conn.end();

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to delete recipe", error: err.message });
  }
};

// PUT /recipes/:id
export const updateRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user.id;
  const { title, ingredients, instructions } = req.body;
  const categoryIds = JSON.parse(req.body.categoryIds || '[]');
  const imagePath = req.file ? req.file.filename : null;

  try {
    const conn = await db.getConnection();

    // Rezept abfragen + Rechte prüfen
    const [result] = await conn.query("SELECT * FROM recipe WHERE id = ?", [recipeId]);
    if (!result || result.user_id !== userId) {
      conn.end();
      return res.status(result ? 403 : 404).json({
        message: result ? "Nicht berechtigt" : "Rezept nicht gefunden"
      });
    }

    // Dynamisches Update-Statement für Felder
    const updateFields = [];
    const values = [];

    if (title) {
      updateFields.push("title = ?");
      values.push(title);
    }
    if (ingredients) {
      updateFields.push("ingredients = ?");
      values.push(ingredients);
    }
    if (instructions) {
      updateFields.push("instructions = ?");
      values.push(instructions);
    }
    if (imagePath) {
      updateFields.push("image_path = ?");
      values.push(imagePath);
    }

    if (updateFields.length > 0) {
      values.push(recipeId);
      await conn.query(
        `UPDATE recipe SET ${updateFields.join(", ")} WHERE id = ?`,
        values
      );
    }

    // Kategorien aktualisieren
    await conn.query("DELETE FROM recipe_category WHERE recipe_id = ?", [recipeId]);
    for (const catId of categoryIds) {
      await conn.query(
        "INSERT INTO recipe_category (recipe_id, category_id) VALUES (?, ?)",
        [recipeId, catId]
      );
    }

    conn.end();
    res.status(200).json({ message: "Rezept erfolgreich aktualisiert" });
  } catch (err) {
    console.error("Fehler beim Aktualisieren:", err);
    res.status(500).json({ message: "Fehler beim Aktualisieren", error: err.message });
  }
};

