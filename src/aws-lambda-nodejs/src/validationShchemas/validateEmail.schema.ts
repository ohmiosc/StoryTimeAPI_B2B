import * as Joi from 'joi';
export const validateEmailSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  token: Joi.string().required(),
});
