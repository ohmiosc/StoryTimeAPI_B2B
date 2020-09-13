import * as Joi from 'joi';
export const loginAlternative = Joi.object().keys({
  appUserID: Joi.string().required(),
  productID: Joi.string().required(),
  deviceID: Joi.string().required(),
  operatorName: Joi.string().required(),
  MSISDN: Joi.string().required(),
  platform: Joi.string(),
  siteID: Joi.number(),
});
