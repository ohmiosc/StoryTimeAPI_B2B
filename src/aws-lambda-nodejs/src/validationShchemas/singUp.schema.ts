import * as Joi from 'joi';
export const singUpSchema = Joi.object().keys({
  productID: Joi.string().required(),
  deviceID: Joi.string().required(),
  appUserID: Joi.string().allow('').required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(12),
  registrationType: Joi.number().min(0).max(4)
});
