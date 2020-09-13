import { Injectable } from '@nestjs/common';
import { errorResponse, ErrorResponse } from '../responses/error_response';
import { IValidator, validateInput, validateProductIDFormat } from '../lib/validator';
import * as constants from '../constants';
import { AppUserDAO } from '../dao/app_user_dao';
import { LogoutResponse} from '../responses/logout_response';
import { ProductDAO } from '../dao/product_dao';

@Injectable()
export class LogoutService {

  constructor(private appUserDAO: AppUserDAO,
              private productDAO: ProductDAO) {
  }

  public async logout(input: any): Promise<LogoutResponse | ErrorResponse> {

    const productValidator: IValidator = validateProductIDFormat(input.productID);

    if (!productValidator.isValid) {
      return errorResponse(constants.BAD_REQUEST.statusCode,
        constants.BAD_REQUEST.status, productValidator.message);
    }

    const appUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, input.appUserID);

    if (!appUser) {
      return errorResponse(constants.NOT_FOUND.statusCode, constants.NOT_FOUND.status,
        `Item with ${input.appUserID} not found inside ${constants.APP_USER_TABLE}`);
    }

    const product = await this.productDAO.getItemFromDB(constants.PRODUCT_TABLE, input.productID);

    if (!product) {
      return errorResponse(constants.NOT_FOUND.statusCode, constants.NOT_FOUND.status,
        `Item with ${input.productID} not found inside ${constants.PRODUCT_TABLE}`);
    }

    if (appUser.productID !== input.productID) {
      return errorResponse(constants.BAD_REQUEST.statusCode,
        constants.BAD_REQUEST.status, 'Invalid product for user supplied');
    }

    appUser.deviceID = undefined;
    await this.appUserDAO.putItemToDB(constants.APP_USER_TABLE, appUser);

    return new LogoutResponse(appUser.id, '', 1, appUser.productID, appUser.userType);
  }

}
