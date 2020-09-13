import * as Joi from 'joi';
export const logoutSchema = Joi.object().keys({
  appUserID: Joi.string().required(),
  productID: Joi.string().required(),
  deviceID:  Joi.string().required()
});
