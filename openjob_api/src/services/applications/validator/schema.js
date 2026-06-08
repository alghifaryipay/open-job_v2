import Joi from 'joi';

export const CreateApplicationSchema = Joi.object({
  user_id: Joi.string().max(50).required(),
  job_id: Joi.string().max(50).required(),
  status: Joi.string().valid('pending', 'accepted', 'rejected').default('pending'),
});

export const UpdateApplicationSchema = Joi.object({
  status: Joi.string().valid('pending', 'accepted', 'rejected').required(),
});
