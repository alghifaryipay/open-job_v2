import { Router } from 'express';
import { validate } from '../../../middleware/validate.js';
import {
  CreateJobPayloadSchema,
  jobUpdatePayloadSchema,
} from '../validator/schema.js';
import authenticateToken from '../../../middleware/auth.js';

import {
  insertNewJob,
  fetchAllJobs,
  findJobDetails,
  fetchJobsByCompany,
  fetchJobsByCategory,
  modifyJobRecord,
  removeJobPosting,
} from '../controller/job-controller.js';

const router = Router();

router.post(
  '/jobs',
  authenticateToken,
  validate(CreateJobPayloadSchema),
  insertNewJob,
);

router.get('/jobs', fetchAllJobs);
router.get('/jobs/category/:id', fetchJobsByCategory);
router.get('/jobs/company/:id', fetchJobsByCompany);
router.get('/jobs/:id', findJobDetails);

router.put(
  '/jobs/:id',
  authenticateToken,
  validate(jobUpdatePayloadSchema),
  modifyJobRecord,
);

router.delete('/jobs/:id', authenticateToken, removeJobPosting);

export default router;
