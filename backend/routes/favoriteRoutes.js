import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  addFavorite,
  removeFavorite,
  getFavoritesForUser
} from '../controllers/favoriteController.js';

const router = express.Router();

router.post('/:recipeId', verifyToken, addFavorite);
router.delete('/:recipeId', verifyToken, removeFavorite);
router.get('/me', verifyToken, getFavoritesForUser);

export default router;
