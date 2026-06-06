import { Router } from 'express';
import {
  CategoryPayloadSchema,
  UpdateCategoryPayloadSchema,
} from '../validator/schema.js';
import { validate } from '../../../middleware/validate.js';
import authenticateToken from '../../../middleware/auth.js';

import {
  insertNewCategory,
  fetchAllCategories,
  findCategoryDetails,
  modifyCategoryRecord,
  removeCategoryRecord,
} from '../controller/category-controller.js';

const router = Router();

router.post(
  '/categories',
  authenticateToken,
  validate(CategoryPayloadSchema),
  insertNewCategory,
);

router.get('/categories', fetchAllCategories);

router.get('/categories/:id', findCategoryDetails);

router.put(
  '/categories/:id',
  authenticateToken,
  validate(UpdateCategoryPayloadSchema),
  modifyCategoryRecord,
);

router.delete(
  '/categories/:id',
  authenticateToken,
  removeCategoryRecord
);

export default router;