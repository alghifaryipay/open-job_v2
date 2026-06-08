import Joi from 'joi';

export const CreateDocumentSchema = Joi.object({
  application_id: Joi.string().max(50).required(),
});