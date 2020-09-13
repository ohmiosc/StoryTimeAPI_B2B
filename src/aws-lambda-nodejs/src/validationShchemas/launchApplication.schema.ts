import * as Joi from 'joi';

export const launchApplicationSchema = Joi.object().keys({
    appUserID: Joi.string().allow('').required(),
    productID: Joi.string().required(),
    deviceID: Joi.string().required(),
    deviceManufacturer: Joi.string(),
    deviceModel: Joi.string(),
    deviceAdvertisingID: Joi.string(),
    deviceOS: Joi.string(),
    appsFlyerRefferal: Joi.string(),
    endTime: Joi.string(),
    launchSource: Joi.string(),
    appVersion: Joi.string(),
    platform: Joi.string(),
    ipAddress: Joi.string().allow('')
});
