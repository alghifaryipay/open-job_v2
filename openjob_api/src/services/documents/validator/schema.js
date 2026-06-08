import Joi from 'joi';

export const CreateDocumentSchema = Joi.object({
  applicationId: Joi.string().max(50).required(), 
});