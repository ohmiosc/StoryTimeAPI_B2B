import {Injectable} from '@nestjs/common';
import {comparePassword, encodeBase64} from '../lib/coder';
import {errorResponse, ErrorResponse} from '../responses/error_response';
import {AppUserDAO} from '../dao/app_user_dao';
import {OperatorDAO} from '../dao/operator_dao';
import {InstallationDAO} from '../dao/installation_dao';

import * as constants from '../constants';
import {IAppUser} from '../models/app_user_model';
import {IInstallation} from '../models/installation_model';
import {LoginRegularResponse} from '../responses/login_regular_response';
import {IValidator, validateInput} from '../lib/validator';

@Injectable()
export class LoginRegularService {
    private appUserID: string;
    private productID: string;
    private deviceID: string;
    private email: string;
    private password: string;
    private platform: string;
    private registrationType: number;

    constructor(private appUserDAO: AppUserDAO,
                private installationDAO: InstallationDAO,
                private operatorDao: OperatorDAO) {
    }

    public async loginRegular(input: any): Promise<LoginRegularResponse | ErrorResponse> {
        const inputValidator: IValidator = validateInput(['productID', 'deviceID', 'appUserID', 'registrationType', 'email'], input);

        if (!inputValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, inputValidator.message);
        }

        this.initializeInputVariables(input);

        console.log('Getting App user with id ' + this.appUserID + ' from DB ...');
        const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, this.appUserID);

        let currentAppUser: IAppUser;
        let isUserAlreadyExists = false;

        if (!appUser) {
            return errorResponse(constants.NOT_FOUND.statusCode, constants.NOT_FOUND.status,
                `Item with ${input.appUserID} not found inside ${constants.APP_USER_TABLE}`);
        }

        if (appUser.signUpProcess === 0 && appUser.userType === constants.IAP_GUEST) {
            console.log(`AppUser ${JSON.stringify(appUser)} is guest`);

            const encodedEmail = encodeBase64(this.email);
            console.log('Encoded email');
            const appUserByEmail: IAppUser = await this.appUserDAO.getItemByGSI(constants.APP_USER_TABLE, 'email-index',
                'email = :email', {':email': encodedEmail});

            if (!appUserByEmail) {
                console.log(`AppUser ${JSON.stringify(appUser)} is not signed up`);
                return new LoginRegularResponse(appUser.id, appUser.deviceID, constants.EMAIL_DOES_NOT_EXIST_ERROR,
                    0, appUser.productID, appUser.userType);
            } else {
                console.log('Existing user with email ' + this.email + ' = ' + appUserByEmail.toString());
                appUserByEmail.deviceID = this.deviceID;
                appUserByEmail.platform = this.platform;
                currentAppUser = appUserByEmail;
                console.log('Current app user = existing user ' + currentAppUser);
                isUserAlreadyExists = true;
            }
        }

        if (!isUserAlreadyExists) {
            currentAppUser = appUser;
        }

        console.log(`Current appUser = ${JSON.stringify(currentAppUser)}`);

        let failureReason = this.checkUserType(currentAppUser.registrationType);

        if (failureReason !== constants.NO_ERROR) {
            return new LoginRegularResponse(appUser.id, appUser.deviceID, failureReason, 0, appUser.productID, appUser.userType);
        }

        if (+this.registrationType === constants.REGULAR) {
            console.log('Regular login');

            if (!this.password) {
                console.log(`Password was not specified `);
                return new LoginRegularResponse(currentAppUser.id, currentAppUser.deviceID, constants.PASSWORD_IS_EMPTY_ERROR,
                    0, currentAppUser.productID, currentAppUser.userType);
            }

            failureReason = await this.checkEmail(this.email, this.registrationType, isUserAlreadyExists);
            if (failureReason === constants.NO_ERROR) {
                failureReason = await this.checkPassword(this.password, currentAppUser.password);
            }

            if (failureReason !== constants.NO_ERROR) {
                return new LoginRegularResponse(currentAppUser.id, currentAppUser.deviceID, failureReason,
                    0, currentAppUser.productID, currentAppUser.userType);
            }

        } else {
            failureReason = await this.checkEmail(this.email, this.registrationType, isUserAlreadyExists);

            if (failureReason !== constants.NO_ERROR) {
                return new LoginRegularResponse(currentAppUser.id, currentAppUser.deviceID, failureReason,
                    0, currentAppUser.productID, currentAppUser.userType);
            }
        }

        if (isUserAlreadyExists) {
            console.log('Deleting guest user from DB' + appUser.toString());
            await this.appUserDAO.deleteItemFromBD(constants.APP_USER_TABLE, appUser.id);
            await this.updateInstallationInfo(currentAppUser.id, appUser.id);
        }

        console.log('Updating current user in DB ' + currentAppUser.toString());
        await this.appUserDAO.putItemToDB(constants.APP_USER_TABLE, currentAppUser);

        console.log('Everything is ok');
        return new LoginRegularResponse(currentAppUser.id, currentAppUser.deviceID, constants.NO_ERROR,
            1, currentAppUser.productID, currentAppUser.userType);
    }

    private async checkPassword(password: string, existingPassword: string): Promise<number> {
        console.log('Checking password ...');

        if (!await comparePassword(password, existingPassword)) {
            console.log('Passwords do not match');
            return constants.INCORRECT_PASSWORD_ERROR;
        }
        return constants.NO_ERROR;
    }

    private async checkEmail(email: string, registrationType: number, isUserExists: boolean): Promise<number> {
        console.log('Checking email address ...');

        if (!isUserExists) {
            console.log('Looking for user by email ' + email);

            const encodedEmail = encodeBase64(email);
            const appUserByEmail: IAppUser = await this.appUserDAO.getItemByGSI(constants.APP_USER_TABLE, 'email-index',
                'email = :email', {':email': encodedEmail});

            if (!appUserByEmail) {
                console.log('User with email = ' + email + ' not found');
                return constants.EMAIL_DOES_NOT_EXIST_ERROR;
            }

            const usersRegistrationType = appUserByEmail.registrationType;

            if (usersRegistrationType == null) {
                console.log('User registration type is null');
                return constants.USER_NOT_FOUND;
            }

            if (usersRegistrationType !== registrationType) {
                console.log('User is found but registrationType is different');
                console.log('Input regType = ' + registrationType + ' found regType = ' + appUserByEmail.registrationType);
                return constants.USER_NOT_FOUND;
            }
        }

        return constants.NO_ERROR;
    }

    private checkUserType(userType: number): number {
        console.log('Checking user type ...');
        if (userType === constants.IAP_GUEST || userType === constants.ALTERNATIVE_GUEST) {
            console.log('User type = ' + userType + '. User ');
            return constants.EMAIL_DOES_NOT_EXIST_ERROR;
        }

        if (userType === constants.ALTERNATIVE_CANCELLED || userType === constants.IAP_CANCELLED) {
            console.log('User type = ' + userType + '. User\'s subscription is cancelled');
            return constants.CANCELLED_USER;
        }

        if (userType === constants.ALTERNATIVE_DISABLED) {
            console.log('User type = ' + userType + '. User\'s subscription is disabled');
            return constants.DISABLED_USER;
        }

        if (userType === constants.ALTERNATIVE_SUBSCRIBED || userType === constants.IAP_SUBSCRIBED) {
            console.log('User type = ' + userType + '. User\'s subscription is active');
            return constants.NO_ERROR;
        }
        return constants.NO_ERROR;
    }

    private async updateInstallationInfo(existingInstallationID: string, newInstallationID: string) {
        console.log(`Updating installation info ... `);

        let existingInstallation: IInstallation = await this.installationDAO.getItemFromDB(constants.INSTALLATION_TABLE, existingInstallationID);
        const newInstallation: IInstallation = await this.installationDAO.getItemFromDB(constants.INSTALLATION_TABLE, newInstallationID);

        const existingInstallationHistory = !existingInstallation.installationHistory ? [] : existingInstallation.installationHistory;
        existingInstallation.installationHistory = undefined;
        existingInstallation.id = undefined;
        existingInstallationHistory.push(existingInstallation);

        existingInstallation = newInstallation;
        existingInstallation.id = existingInstallationID;
        existingInstallation.installationHistory = existingInstallationHistory;

        console.log(`New installation = ${JSON.stringify(existingInstallation)}`);

        await this.installationDAO.deleteItemFromBD(constants.INSTALLATION_TABLE, newInstallationID);
        await this.installationDAO.putItemToDB(constants.INSTALLATION_TABLE, existingInstallation);

    }

    private initializeInputVariables(input: any): void {
        this.appUserID = input.appUserID;
        this.productID = input.productID;
        this.deviceID = input.deviceID;
        this.platform = input.platform;
        this.email = input.email.toLowerCase();
        this.password = input.password;
        this.registrationType = input.registrationType;
    }
}
