import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { createRecipe } from '../controllers/recipeController.js';

const router = express.Router();

router.post('/', verifyToken, createRecipe);

export default router;
