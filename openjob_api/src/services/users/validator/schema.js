import Joi from 'joi';

export const UserPayloadSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().required().email(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required(),
});
