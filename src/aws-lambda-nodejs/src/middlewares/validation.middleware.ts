import { BadRequestException, MiddlewareFunction, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as Joi from 'joi';
import { VALIDATION_FAILED } from '../messages/messages';
import * as constants from '../constants';

export const requestValidatorMiddleware: MiddlewareFunction = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: Function) => {
  const { error, value } = Joi.validate(req.body, schema);
  if (error) {
    const errorMessage = error.details.shift().message;
    const message: string = errorMessage.replace(/["]/g, '');

    return next(
      new HttpException({
        statusCode: constants.BAD_REQUEST.statusCode,
        status: constants.BAD_REQUEST.status,
        message: `${VALIDATION_FAILED['en']}: ${message}`
      }, constants.BAD_REQUEST.statusCode)
    );
  }
  next();
};
