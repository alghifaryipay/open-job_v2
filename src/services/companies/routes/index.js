import { Router } from 'express';
import { validate } from '../../../middleware/validate.js';
import {
  CompanyPayloadSchema,
  UpdateCompanyPayloadSchema,
} from '../validator/schema.js';
import authenticateToken from '../../../middleware/auth.js';

import {
  insertCompanyRecord,
  fetchAllCompanies,
  findCompanyDetails,
  modifyCompanyRecord,
  deleteCompanyRecord,
} from '../controller/company-controller.js';

const router = Router();

router.post(
  '/companies',
  authenticateToken,
  validate(CompanyPayloadSchema),
  insertCompanyRecord,
);

router.get('/companies', fetchAllCompanies);

router.get('/companies/:id', findCompanyDetails);

router.put(
  '/companies/:id',
  authenticateToken,
  validate(UpdateCompanyPayloadSchema),
  modifyCompanyRecord,
);

router.delete('/companies/:id', authenticateToken, deleteCompanyRecord);

export default router;
