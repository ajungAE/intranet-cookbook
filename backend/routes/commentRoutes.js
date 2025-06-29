import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  addComment,
  getCommentsByRecipe,
  deleteComment,
  updateComment
} from '../controllers/commentController.js';

const router = express.Router();

router.post('/:recipeId', verifyToken, addComment);
router.get('/:recipeId', getCommentsByRecipe);
router.delete('/:commentId', verifyToken, deleteComment);
router.patch('/:commentId', verifyToken, updateComment);



export default router;
