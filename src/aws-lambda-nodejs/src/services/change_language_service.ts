import { Injectable } from '@nestjs/common';
import { AppUserDAO } from '../dao/app_user_dao';
import { errorResponse, ErrorResponse } from '../responses/error_response';
import { ChangeLanguageResponse} from '../responses/change_language_response';
import { IValidator, validateInput, validateProductIDFormat } from '../lib/validator';
import * as constants from '../constants';
import { IAppUser, IProduct } from '../models/app_user_model';
import { ProductDAO } from '../dao/product_dao';
import { AppUserProductProgression } from '../models/app_user_product_progression_model';
import { AppUserProgressionVideosByProduct } from '../models/app_user_product_progression_by_video_model';
import { AppUserProductProgressionDAO } from '../dao/app_user_product_progression_dao';
import { AppUserProgressionQuestionsByProduct } from '../models/app_user_product_progression_by_questions_model';
import { IProductModel } from '../models/product_model';
import { AppUserProgressionQuestionsByProductDAO } from '../dao/app_user_product_progression_by_questions_dao';
import { AppUserProgressionVideosByProductDAO } from '../dao/app_user_product_progression_by_video_dao';

@Injectable()
export class ChangeLanguageService {

    constructor(private appUserDAO: AppUserDAO,
                private productDAO: ProductDAO,
                private vocabsDAO: AppUserProductProgressionDAO,
                private questionsDAO: AppUserProgressionQuestionsByProductDAO,
                private videosDAO: AppUserProgressionVideosByProductDAO,
    ) {
    }

    public async changeLanguage(input: any): Promise<ChangeLanguageResponse | ErrorResponse> {

        const inputValidator: IValidator = validateInput(['appUserID', 'productID', 'deviceID', 'productIDNew'], input);

        if (!inputValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, inputValidator.message);
        }

        let productValidator: IValidator = validateProductIDFormat(input.productID);

        if (!productValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, productValidator.message);
        }

        productValidator = validateProductIDFormat(input.productIDNew);

        if (!productValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, productValidator.message);
        }

        const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, input.appUserID);

        if (!appUser) {
            return errorResponse(constants.NOT_FOUND.statusCode, constants.NOT_FOUND.status,
                `Item with ${input.appUserID} not found inside ${constants.APP_USER_TABLE}`);
        }

        if (!appUser.products || appUser.products.length === 0) {
            return errorResponse(constants.INTERNAL_SERVER_ERROR.statusCode, constants.INTERNAL_SERVER_ERROR.status,
                `AppUser with ${input.appUserID} id has not active products`);
        }

        const product: IProductModel = await this.productDAO.getItemFromDB(constants.PRODUCT_TABLE, input.productID);

        if (!product) {
            return errorResponse(constants.NOT_FOUND.statusCode, constants.NOT_FOUND.status,
                `Item with ${input.productID} not found inside ${constants.PRODUCT_TABLE}`);
        }

        const productList: IProduct[] = this.getUpdatedProductsList(appUser.products, input.productIDNew, input.deviceID);

        const vocabsData: AppUserProductProgression = await this.vocabsDAO.getItemByGSI(
            constants.APP_USER_PROGRESSION_BY_PRODUCT_TABLE,
            'appUserID-productID-index',
            'appUserID = :appUserID',
            { ':appUserID': input.appUserID },
        );

        const videosData: AppUserProgressionVideosByProduct = await this.videosDAO.getItemByGSI(
            constants.APP_USER_PROGRESSION_VIDEOS_BY_PRODUCT_TABLE,
            'appUserID-productID-index',
            'appUserID = :appUserID',
            { ':appUserID': input.appUserID },
        );

        const questionsData: AppUserProgressionQuestionsByProduct = await this.questionsDAO.getItemByGSI(
            constants.APP_USER_PROGRESSION_QUESTIONS_BY_PRODUCT_TABLE,
            'appUserID-productID-index',
            'appUserID = :appUserID',
            { ':appUserID': input.appUserID },
        );

        if (vocabsData !== null) {
            await this.vocabsDAO.deleteItemFromBD(constants.APP_USER_PROGRESSION_BY_PRODUCT_TABLE, vocabsData.id);
        }

        if (videosData !== null) {
            await this.videosDAO.deleteItemFromBD(constants.APP_USER_PROGRESSION_VIDEOS_BY_PRODUCT_TABLE, videosData.id);
        }

        if (questionsData !== null) {
            await this.questionsDAO.deleteItemFromBD(constants.APP_USER_PROGRESSION_QUESTIONS_BY_PRODUCT_TABLE, questionsData.id);
        }

        appUser.products = productList;
        appUser.deviceID = input.deviceID;
        appUser.productID = input.productIDNew;
        appUser.lastLanguage = input.productIDNew.split('-')[1];

        await this.appUserDAO.putItemToDB(constants.APP_USER_TABLE, appUser);

        return new ChangeLanguageResponse(appUser.id, appUser.deviceID, 1, appUser.productID, appUser.userType);

    }

    private getUpdatedProductsList(existingProducts: IProduct[], newProductID: string, deviceID: string): IProduct[] {

        const sameProduct = existingProducts.filter(product => product.productId === newProductID)[0];

        if (!sameProduct) {
            const newProduct: IProduct = { deviceId: deviceID, productId: newProductID };
            existingProducts.push(newProduct);
        }

        return existingProducts;

    }
}
