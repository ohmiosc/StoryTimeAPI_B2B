import { VocabsUserResponse } from '../responses/vocabs_user_response';
import { errorResponse, ErrorResponse } from '../responses/error_response';
import * as constants from '../constants';
import { IValidator, validateInput, validateProductIDFormat } from '../lib/validator';
import { randomUUIDV4 } from '../lib/generator';
import { AppUserDAO } from '../dao/app_user_dao';
import { ProductDAO } from '../dao/product_dao';
import { AppUserProductProgressionDAO } from '../dao/app_user_product_progression_dao';
import { IAppUser } from '../models/app_user_model';
import { AppUserProductProgression } from '../models/app_user_product_progression_model';
import { IProductModel } from '../models/product_model';
import { ProgressService } from './progress_service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VocabsService {

  constructor(  private appUserDAO: AppUserDAO,
                private productDAO: ProductDAO,
                private appUserProductProgressionDAO: AppUserProductProgressionDAO,
                private progressService: ProgressService,
    ) {}

  public async saveAppUserProgressionVocabs(input: any): Promise<VocabsUserResponse | ErrorResponse> {
    const inputValidator: IValidator = validateInput(['productID', 'versionID', 'appUserID',
      'lastSeenCategory', 'lastPlayedLevel', 'vocabsUserDataList'], input);
    if (input === null || !inputValidator.isValid) {
      return errorResponse(constants.BAD_REQUEST.statusCode,
        constants.BAD_REQUEST.status, inputValidator.message);
    }

    const userID: string = input.appUserID;
    const appUserInput: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, userID);
    if (appUserInput === null) {
      return errorResponse(constants.BAD_REQUEST.statusCode,
        constants.BAD_REQUEST.status, 'No data found for user id');
    }

    const productID: string = input.productID;
    const product: IProductModel = await this.productDAO.getItemFromDB(constants.PRODUCT_TABLE, productID);
    if (product === null) {
      return errorResponse(constants.BAD_REQUEST.statusCode,
        constants.BAD_REQUEST.status, 'No data found for product id');
    }
    const userProgression: AppUserProductProgression =
      await this.appUserProductProgressionDAO.getItemByGSI(
        constants.APP_USER_PROGRESSION_BY_PRODUCT_TABLE,
        'appUserID-productID-index',
        'appUserID = :appUserID',
        { ':appUserID': userID },
      );

    const response: VocabsUserResponse = { message: 'New entry created OK' };
    if (userProgression === null) {
      const appUser = new AppUserProductProgression();
      appUser.id = randomUUIDV4();
      await this.updateUsersProgression(appUser, input);
      console.log('New user created');
    } else {
      await this.updateUsersProgression(userProgression, input);
      console.log('Old user updated OK');
      response.message = 'Old user updated OK';
    }

    return (response);
  }

  public async getAppUserProgressionVocabs(input: any): Promise<AppUserProductProgression | ErrorResponse> {
    const inputValidator: IValidator = validateInput(['productID', 'appUserID'], input);

    if (input === null || !inputValidator.isValid) {
      return errorResponse(constants.BAD_REQUEST.statusCode,
        constants.BAD_REQUEST.status, inputValidator.message);
    }

    const productValidator: IValidator = validateProductIDFormat(input.productID);

    if (!productValidator.isValid) {
      return errorResponse(constants.BAD_REQUEST.statusCode,
        constants.BAD_REQUEST.status, productValidator.message);
    }

    const appUserInput: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, input.appUserID);
    if (appUserInput === null) {
      return errorResponse(constants.NOT_FOUND.statusCode,
        constants.NOT_FOUND.status, 'No data found for user id');
    }

    const product: IProductModel = await this.productDAO.getItemFromDB(constants.PRODUCT_TABLE, input.productID);
    if (product === null) {
      return errorResponse(constants.NOT_FOUND.statusCode,
        constants.NOT_FOUND.status, 'No data found for product id');
    }

    let vocabsProgression: AppUserProductProgression = await this.appUserProductProgressionDAO.getItemByGSI(
      constants.APP_USER_PROGRESSION_BY_PRODUCT_TABLE,
      'appUserID-productID-index',
      'appUserID = :appUserID',
      { ':appUserID': input.appUserID },
    );

    if (vocabsProgression === null) {
      vocabsProgression = new AppUserProductProgression();
      vocabsProgression.appUserID = input.appUserID;
      vocabsProgression.productID = input.productID;
      vocabsProgression.vocabsUserDataList = [];
      vocabsProgression.lastPlayedLevel = [];
    }

    return vocabsProgression;
  }

  private async updateUsersProgression(appUser, input): Promise<void> {
    appUser.appUserID = input.appUserID;
    appUser.productID = input.productID;
    appUser.versionID = input.versionID;
    appUser.lastSeenCategory = input.lastSeenCategory;
    appUser.lastPlayedLevel = input.lastPlayedLevel;
    appUser.vocabsUserDataList = input.vocabsUserDataList;
    try {
      await this.appUserProductProgressionDAO.putItemToDB(constants.APP_USER_PROGRESSION_BY_PRODUCT_TABLE, appUser);
      /** Important! next two lines updates same entity in dynamodb  - should be refactored (allready discussed with Alex.D) */
      appUser.sessionID = input.sessionID;
      await this.progressService.updateLevelsProgress(appUser, appUser.lastPlayedLevel);

      await this.progressService.updateVocabsProgress(appUser, appUser.vocabsUserDataList);
    } catch (error) {
      console.log(`Error occurs while updating users progression: ${error}`);
    }

  }
}
