import { AppUserDAO } from '../dao/app_user_dao';
import { ProductDAO } from '../dao/product_dao';
import { AppUserProgressionVideosByProductDAO } from '../dao/app_user_product_progression_by_video_dao';
import { ProgressService } from './progress_service';
import { VideosUserResponse } from '../responses/videos_user_response';
import { errorResponse, ErrorResponse } from '../responses/error_response';
import { IValidator, validateInput, validateProductIDFormat } from '../lib/validator';
import { randomUUIDV4 } from '../lib/generator';
import * as constants from '../constants';
import { IAppUser } from '../models/app_user_model';
import { IProductModel } from '../models/product_model';
import { AppUserProgressionVideosByProduct } from '../models/app_user_product_progression_by_video_model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VideosService {

    constructor(private progressService: ProgressService,
                private AppUserProgressionVideosByProductDAO: AppUserProgressionVideosByProductDAO,
                private appUserDAO: AppUserDAO,
                private productDAO: ProductDAO,
      ){
    }
    public async saveAppUserProgressionVideos(input: any): Promise < VideosUserResponse | ErrorResponse > {
        const inputValidator: IValidator = validateInput(['productID', 'versionID', 'appUserID', 'franchiseUserDataList', 'videosProgress'], input);
        if (input === null || !inputValidator.isValid){
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, inputValidator.message);
        }

        const userID: string = input.appUserID;
        const appUserInput: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, userID);
        if (appUserInput === null){
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, 'No data found for user id');
        }

        const productID: string = input.productID;
        const product: IProductModel = await this.productDAO.getItemFromDB(constants.PRODUCT_TABLE, productID);
        if (product === null){
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, 'No data found for product id');
        }
        const userProgression: AppUserProgressionVideosByProduct  =
                    await this.AppUserProgressionVideosByProductDAO.getItemByGSI(
                            constants.APP_USER_PROGRESSION_VIDEOS_BY_PRODUCT_TABLE,
                            'appUserID-productID-index',
                            'appUserID = :appUserID',
                            { ':appUserID': userID },
                        );
        const response: VideosUserResponse = { message: 'New entry created OK' };
        if (userProgression === null){
            const appUser = new AppUserProgressionVideosByProduct();
            appUser.id = randomUUIDV4();
            await this.updateUsersProgression(appUser, input);
        } else {
            await this.updateUsersProgression(userProgression, input);
            response.message = 'Old user updated OK';
        }

        return (response);
    }

  public async getAppUserProgressionVideos(input: any): Promise<AppUserProgressionVideosByProduct | ErrorResponse> {
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

    const userID: string = input.appUserID;
    const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, userID);
    if (appUser === null) {
      return errorResponse(constants.NOT_FOUND.statusCode,
        constants.NOT_FOUND.status, 'No data found for user id');
    }

    let videosProgression: AppUserProgressionVideosByProduct = await this.AppUserProgressionVideosByProductDAO.getItemByGSI(
      constants.APP_USER_PROGRESSION_VIDEOS_BY_PRODUCT_TABLE,
      'appUserID-productID-index',
      'appUserID = :appUserID',
      { ':appUserID': userID },
    );

    if (!videosProgression) {
      videosProgression = new AppUserProgressionVideosByProduct();
      videosProgression.appUserID = appUser.id;
      videosProgression.productID = appUser.productID;
      videosProgression.franchiseUserDataList = [];
      videosProgression.videosProgress = [];
    }

    return videosProgression;
  }

  private async updateUsersProgression(appUser, input): Promise<void> {
        appUser.appUserID = input.appUserID;
        appUser.productID = input.productID;
        appUser.versionID = input.versionID;
        appUser.videosProgress = input.videosProgress;
        appUser.franchiseUserDataList = input.franchiseUserDataList;

        try{
            await this.AppUserProgressionVideosByProductDAO.putItemToDB(constants.APP_USER_PROGRESSION_VIDEOS_BY_PRODUCT_TABLE, appUser);
            /** Important! next two lines updates same entity in dynamodb  - should be refactored (allready discussed with Alex.D) */
            appUser.sessionID = input.sessionID;
            await this.progressService.updateVideosProgress(appUser, input.videosProgress);
            await this.progressService.updateVideosFranchiseProgress(appUser, input.franchiseUserDataList);
        } catch (error) {
            console.log(`Error occurs whle updating users progression: ${error}`);
        }

    }
}
