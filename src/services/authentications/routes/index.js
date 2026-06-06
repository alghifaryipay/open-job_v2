import { Router } from 'express';
import {
  postAuthenticationPayloadSchema,
  putAuthenticationPayloadSchema,
  deleteAuthenticationPayloadSchema,
} from '../validator/schema.js';
import { validate } from '../../../middleware/validate.js';
import authenticateToken from '../../../middleware/auth.js';

import {
  authenticateUserLogin,
  renewAccessToken,
  processUserLogout,
} from '../controller/authentication-controller.js';

const router = Router();

router.post(
  '/authentications',
  validate(postAuthenticationPayloadSchema),
  authenticateUserLogin,
);

router.put(
  '/authentications',
  validate(putAuthenticationPayloadSchema),
  renewAccessToken,
);

router.delete(
  '/authentications',
  authenticateToken,
  validate(deleteAuthenticationPayloadSchema),
  processUserLogout,
);

export default router;
