import Joi from 'joi';

export const CompanyPayloadSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
});

export const UpdateCompanyPayloadSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  location: Joi.string(),
}).min(1);
