import * as Joi from 'joi';

export const legalSignedSchema = Joi.object().keys({
    appUserID: Joi.string().allow('').required(),
    productID: Joi.string().required(),
    deviceID: Joi.string().required(),
    isLegalSigned: Joi.number()
});
