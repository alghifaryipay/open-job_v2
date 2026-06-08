import Joi from "joi";

export const CreateJobPayloadSchema = Joi.object({
  title: Joi.string().required(),

  description: Joi.string().required(),

  job_type: Joi.string()
    .valid("full-time", "part-time", "contract", "internship")
    .required(),

  experience_level: Joi.string()
    .valid("junior", "mid", "senior")
    .required(),

  location_type: Joi.string()
    .valid("remote", "onsite", "hybrid")
    .required(),

  location_city: Joi.string().allow(null, ""),

  salary_min: Joi.number().integer().min(0),

  salary_max: Joi.number()
    .integer()
    .custom((value, helpers) => {
      const { salary_min } = helpers.state.ancestors[0];
      if (salary_min !== undefined && value < salary_min) {
        return helpers.error('any.invalid');
      }
      return value;
    }),

  is_salary_visible: Joi.boolean().default(true),

  status: Joi.string()
    .valid("open", "close", "draft")
    .required(),

  company_id: Joi.string().max(50).required(),

  category_id: Joi.string().max(50).required(),
});

export const jobUpdatePayloadSchema = Joi.object({
  title: Joi.string(),

  description: Joi.string(),

  job_type: Joi.string().valid("full-time", "part-time", "contract", "internship"),

  experience_level: Joi.string().valid("junior", "mid", "senior"),

  location_type: Joi.string().valid("remote", "onsite", "hybrid"),

  location_city: Joi.string().allow(null, ""),

  salary_min: Joi.number().integer().min(0),

  salary_max: Joi.number()
    .integer()
    .custom((value, helpers) => {
      const { salary_min } = helpers.state.ancestors[0];
      if (salary_min !== undefined && value < salary_min) {
        return helpers.error('any.invalid');
      }
      return value;
    }),

  is_salary_visible: Joi.boolean(),

  status: Joi.string().valid("open", "close", "draft"),

  company_id: Joi.string().max(50),
  
  category_id: Joi.string().max(50),
}).min(1);