import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createRecipe, getAllRecipes, getRecipeById, deleteRecipe } from '../controllers/recipeController.js';
import upload from "../config/multer.js";

const router = express.Router();

router.post("/", verifyToken, upload.single("image"), createRecipe);
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.delete("/:id", verifyToken, deleteRecipe);

export default router;
