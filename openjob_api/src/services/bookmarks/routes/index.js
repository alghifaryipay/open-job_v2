import { Router } from 'express';
import authenticateToken from '../../../middleware/auth.js';

import {
  addJobToBookmarks,
  fetchUserBookmarks,
  findBookmarkDetails,
  removeJobFromBookmarks,
} from '../controller/bookmark-controller.js';

const router = Router();

router.post('/jobs/:id/bookmark', authenticateToken, addJobToBookmarks);

router.get('/bookmarks', authenticateToken, fetchUserBookmarks);

router.get(
  '/jobs/:id/bookmark/:bookmarkId',
  authenticateToken,
  findBookmarkDetails,
);

router.delete('/jobs/:id/bookmark', authenticateToken, removeJobFromBookmarks);

export default router;
