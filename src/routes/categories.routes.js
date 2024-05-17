import { Router } from 'express';
import {
  findCategoryById,
  createCategory,
  deleteCategory,
  updateCategory,
  getAllCategories
} from '../controllers/categories.controller.js';
import { validarJWT, haveRol } from '../middleware/index.js';

const router = Router();

router.get('/', getAllCategories);
router.post('/', createCategory);
router.get('/:id', findCategoryById);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
