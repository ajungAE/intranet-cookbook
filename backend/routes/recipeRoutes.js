import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createRecipe, getAllRecipes, getRecipeById, deleteRecipe, updateRecipe } from '../controllers/recipeController.js';
import upload from "../config/multer.js";

const router = express.Router();

router.post("/", verifyToken, upload.single("image"), createRecipe);
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.delete("/:id", verifyToken, deleteRecipe);
router.put('/:id', verifyToken, upload.single('image'), updateRecipe);


export default router;
