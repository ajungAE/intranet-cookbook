import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { createRecipe } from '../controllers/recipeController.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/', verifyToken, upload.single('image'), createRecipe);

export default router;
