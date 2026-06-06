import { Router } from 'express';
import { validate } from '../../../middleware/validate.js';
import { UserPayloadSchema } from '../validator/schema.js';
import {
  registerNewUser,
  findUserDetails,
} from '../controller/user-controller.js';

const router = Router();

router.post('/users', validate(UserPayloadSchema), registerNewUser);

router.get('/users/:id', findUserDetails);

export default router;
