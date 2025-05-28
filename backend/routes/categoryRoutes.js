import express from 'express';
import { getAllCategories, createCategory, assignCategoryToRecipe } from '../controllers/categoryController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', verifyToken, createCategory);
router.post('/assign/:recipeId', verifyToken, assignCategoryToRecipe);

export default router;
