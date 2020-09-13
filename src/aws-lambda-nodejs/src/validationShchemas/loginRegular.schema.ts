import * as Joi from 'joi';
export const loginRegular = Joi.object().keys({
  appUserID: Joi.string().required(),
  productID: Joi.string().required(),
  deviceID: Joi.string().required(),
  registrationType: Joi.number().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  platform: Joi.string()
});
