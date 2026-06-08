import { Router } from 'express';
import users from '../services/users/routes/index.js';
import authentications from '../services/authentications/routes/index.js';
import companies from '../services/companies/routes/index.js';
import categories from '../services/categories/routes/index.js';
import jobs from '../services/jobs/routes/index.js';
import applications from '../services/applications/routes/index.js';
import bookmarks from '../services/bookmarks/routes/index.js';

const router = Router();

router.use('/', users);
router.use('/', authentications);
router.use('/', companies);
router.use('/', categories);
router.use('/', jobs);
router.use('/', applications);
router.use('/', bookmarks);

export default router;
