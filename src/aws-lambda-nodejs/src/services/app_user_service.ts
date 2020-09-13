import {errorResponse, ErrorResponse} from '../responses/error_response';
import {Injectable} from '@nestjs/common';
import {AppUserDAO} from '../dao/app_user_dao';
import {IAppUser} from '../models/app_user_model';
import {isInt, IValidator, validateInput, validateProductIDFormat} from '../lib/validator';
import * as constants from '../constants';
import {GetAppUserByIdResponse} from '../responses/get_app_user_by_id_response';
import {SubscriptionHistoryDAO} from '../dao/subscription_history_dao';
import {decodeBase64, encodeBase64} from '../lib/coder';
import {SaveOptinResponse} from '../responses/save_optin_response';
import {formatCurrentDate} from '../lib/generator';
import {LegalSignedResponse} from '../responses/legal_signed_respose';
import {MandrillClient} from '../lib/mandrill_client';
import {UpdateUserTypeResponse} from '../responses/update_user_type_response';
import { Signed } from '../responses/launch_app_response';

@Injectable()
export class AppUserService {

    private mandrillClient;

    constructor(private appUserDAO: AppUserDAO,
                private subscriptionHistoryDAO: SubscriptionHistoryDAO) {
        this.mandrillClient = new MandrillClient();

    }

    public async getAppUser(input: any): Promise<GetAppUserByIdResponse | ErrorResponse> {
        let response: (GetAppUserByIdResponse | ErrorResponse);
        const inputValidator: IValidator = validateInput(['appUserID'], input);

        if (!inputValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, inputValidator.message);
        }

        const item = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, input.appUserID);

        if (!item) {
            return errorResponse(constants.NOT_FOUND.statusCode, constants.NOT_FOUND.status,
                `Item with ${input.appUserID} not found inside ${constants.APP_USER_TABLE}`);
        }

        response = await this.formResponse(item);
        return response;
    }

    public async saveOptin(input: any): Promise<SaveOptinResponse | ErrorResponse> {

        const inputValidator: IValidator = validateInput(['appUserID', 'deviceID', 'productID', 'isAdult'], input);

        if (!inputValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, inputValidator.message);
        }

        if (input.isAdult === 0 && input.email == null) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, 'The body should contain email if isAdult = 0');
        }

        const productValidator: IValidator = validateProductIDFormat(input.productID);

        if (!productValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, productValidator.message);
        }

        const appUserID = input.appUserID;
        const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, appUserID);

        if (!appUser) {
            return errorResponse(constants.NOT_FOUND.statusCode, constants.NOT_FOUND.status,
                `User with id = ${appUserID} not found`);
        }

        const isAdult = input.isAdult;

        if (isAdult === 0) {
            const language = input.productID.split('-')[1].toUpperCase();
            const welcomeTemplate = constants.WELCOME_TEMPLATE_B2B + language;
            // await this.mandrillClient.sendMail(constants.WELCOME_EMAIL_SUBJECT, welcomeTemplate, input.email);
            appUser.email = encodeBase64(input.email);
        }

        const currentDate = formatCurrentDate(new Date().getTime());

        appUser.ageOptin = 1;
        appUser.ageOptinDate = currentDate;
        appUser.isAdult = input.isAdult;
        appUser.isValidated = 1;

        await this.appUserDAO.putItemToDB(constants.APP_USER_TABLE, appUser);

        return new SaveOptinResponse(constants.OK.status, constants.OK.statusCode, constants.OK.status,
            appUser.id, appUser.deviceID, 1, appUser.productID, appUser.userType);
    }

    public async signLegal(input: any): Promise<LegalSignedResponse | ErrorResponse> {

        const productValidator: IValidator = validateProductIDFormat(input.productID);

        if (!productValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, productValidator.message);
        }

        const appUserID = input.appUserID;
        const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, appUserID);

        if (!appUser) {
            return errorResponse(constants.NOT_FOUND.statusCode, constants.NOT_FOUND.status,
                `AppUser with ${appUserID} was not found inside ${constants.APP_USER_TABLE}`);
        }

        const currentDate = formatCurrentDate(new Date().getTime());

        appUser.isLegalSigned = 1;
        appUser.legalDate = currentDate;

        await this.appUserDAO.putItemToDB(constants.APP_USER_TABLE, appUser);

        return new LegalSignedResponse(appUser.id, appUser.deviceID, 1, appUser.productID, appUser.userType);
    }

    public async updateUserType(input: any): Promise<UpdateUserTypeResponse | ErrorResponse> {
        const inputValidator: IValidator = validateInput(['appUserID', 'deviceID', 'productID', 'userType'], input);

        if (!inputValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, inputValidator.message);
        }

        const productValidator: IValidator = validateProductIDFormat(input.productID);

        if (!productValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, productValidator.message);
        }

        const appUserID = input.appUserID;
        const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, appUserID);

        if (!appUser) {
            return errorResponse(constants.NOT_FOUND.statusCode, constants.NOT_FOUND.status,
                `AppUser with ${appUserID} id was not found inside ${constants.APP_USER_TABLE}`);
        }

        if (!isInt(input.userType) || input.userType < 0  ||  input.userType > 6) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, 'UserType should be 0, 1, 2, 3, 4, 5 or 6');
        }

        appUser.userType = input.userType;

        await this.appUserDAO.putItemToDB(constants.APP_USER_TABLE, appUser);

        return new UpdateUserTypeResponse(appUser.id, appUser.deviceID, 1, appUser.productID, appUser.userType);
    }

    private async formResponse(item: IAppUser): Promise<GetAppUserByIdResponse> {
        const legal: Signed = {isSigned: item.isLegalSigned, date: item.legalDate};
        const ageOptIn: Signed = {isSigned: item.ageOptin, date: item.ageOptinDate};
        const signUpProcess: Signed = {isSigned: item.signUpProcess, date: item.signUpProcessDate};

        let subscription;

        try {
            subscription = await this.subscriptionHistoryDAO.getItemFromDB(constants.SUBSCRIPTION_HISTORY_TABLE, item.id);
            if (subscription && subscription.statusCode === 404) {
                subscription = null;
            }
        } catch (e) {
            subscription = null;
        }

        const subscriptionPrice = subscription === null ? null : subscription.localPrice;
        const expireDate = subscription === null ? null : subscription.expirationDate;
        const email = !item.email ? undefined : decodeBase64(item.email);

        return new GetAppUserByIdResponse(ageOptIn, item.id, item.deviceID,
            email, expireDate, legal, item.productID, signUpProcess, subscriptionPrice,
          item.userType, item.msisdn, item.operatorsList, item.registeredOperatorName);
    }
}
