import {Injectable} from '@nestjs/common';
import {errorResponse, ErrorResponse} from '../responses/error_response';
import {SignUpResponse} from '../responses/sign_up_response';
import {IValidator, validateProductIDFormat} from '../lib/validator';
import * as constants from '../constants';
import {AppUserDAO} from '../dao/app_user_dao';
import {ProductDAO} from '../dao/product_dao';
import {IProductModel} from '../models/product_model';
import {encodeBase64, hashPassword} from '../lib/coder';
import {IAppUser} from '../models/app_user_model';
import {MandrillClient} from '../lib/mandrill_client';
import {formatCurrentDate} from '../lib/generator';
import {EmailService} from './email_service';
import { Signed } from '../responses/launch_app_response';

@Injectable()
export class SignUpService {

    private appUserDAO;
    private productDAO;
    private verificationTokenDAO;

    private appUserID: string;
    private productID: string;
    private deviceID: string;
    private email: string;
    private password: string;
    private registrationType: number;

    private mandrillClient: MandrillClient;

    constructor(private emailService: EmailService) {
        this.appUserDAO = new AppUserDAO();
        this.productDAO = new ProductDAO();
        // this.verificationTokenDAO = new VerificationTokenDAO();
        this.mandrillClient = new MandrillClient();

    }

    public async signUp(input: any): Promise<SignUpResponse | ErrorResponse> {

        this.initializeInputVariables(input);

        const productValidator: IValidator = validateProductIDFormat(this.productID);

        if (!productValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, productValidator.message);
        }

        const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, this.appUserID);

        if (!appUser) {
            return errorResponse(constants.NOT_FOUND.statusCode, constants.NOT_FOUND.status,
                `Item with ${this.appUserID} not found inside ${constants.APP_USER_TABLE}`);
        }

        const product: IProductModel = await this.productDAO.getItemFromDB(constants.PRODUCT_TABLE, this.productID);

        if (!product) {
            return errorResponse(constants.NOT_FOUND.statusCode, constants.NOT_FOUND.status,
                `Item with ${this.productID} not found inside ${constants.PRODUCT_TABLE}`);
        }

        const language = this.productID.split('-')[1].toUpperCase();
        console.log('Language = ' + language);

        const ageOptin: Signed = {isSigned: appUser.ageOptin, date: appUser.ageOptinDate};
        const legal: Signed = {isSigned: appUser.isLegalSigned, date: appUser.legalDate};
        const signUpProcess: Signed = {isSigned: appUser.signUpProcess, date: appUser.signUpProcessDate};
        const encodedEmail = encodeBase64(this.email);
        console.log(`Encoded email = ${encodedEmail}`);

        if (this.email) {
            const appUserByEmail: IAppUser = await this.appUserDAO.getItemByGSI(constants.APP_USER_TABLE, 'email-index',
                'email = :email', {':email': encodedEmail});

            if (appUserByEmail) {
                return new SignUpResponse(ageOptin, appUser.id, appUser.deviceID, constants.EMAIL_ALREADY_EXISTS_ERROR, 0,
                    legal, appUser.productID, signUpProcess, appUser.userType);
            }
        }

        const welcomeTemplate = constants.WELCOME_TEMPLATE_B2B + language;

        switch (this.registrationType) {
            case constants.UNKNOWN:
                appUser.registrationType = constants.UNKNOWN;
                break;
            case constants.REGULAR:

                if (!this.password) {
                    return new SignUpResponse(ageOptin, appUser.id, appUser.deviceID, constants.PASSWORD_IS_EMPTY_ERROR, 0,
                        legal, appUser.productID, signUpProcess, appUser.userType);
                }

                const encodedPassword = await hashPassword(this.password);

                if (!encodedPassword) {
                    return new SignUpResponse(ageOptin, appUser.id, appUser.deviceID, constants.INCORRECT_PASSWORD_ERROR, 0,
                        legal, appUser.productID, signUpProcess, appUser.userType);
                }

                appUser.registrationType = this.registrationType;
                appUser.email = encodedEmail;
                appUser.password = encodedPassword;

                // await this.mandrillClient.sendMail(constants.WELCOME_EMAIL_SUBJECT, welcomeTemplate, this.email);
                // await this.emailService.sendVerificationEmail(appUser.id, language, this.email, encodedEmail);
                break;
            case constants.FACEBOOK:
                appUser.registrationType = constants.FACEBOOK;
                appUser.email = encodedEmail;
                appUser.isValidated = 1;
                if (this.email.split('@')[1] !== constants.FACEBOOK_DOMAIN) {
                    await this.mandrillClient.sendMail(constants.WELCOME_EMAIL_SUBJECT, welcomeTemplate, this.email);
                }
                break;
            case constants.GOOGLE:
                appUser.registrationType = constants.GOOGLE;
                appUser.email = encodedEmail;

                // await this.mandrillClient.sendMail(constants.WELCOME_EMAIL_SUBJECT, welcomeTemplate, this.email);
                // await this.emailService.sendVerificationEmail(appUser.id, language, this.email, encodedEmail);
                break;
            case constants.NO_INFO:
                appUser.registrationType = constants.NO_INFO;
                if (!this.email) {
                    appUser.isValidated = 1;
                }
                break;
        }

        signUpProcess.isSigned = 1;
        signUpProcess.date = formatCurrentDate(new Date().getTime());

        appUser.signUpProcess = signUpProcess.isSigned;
        appUser.signUpProcessDate = signUpProcess.date;

        await this.appUserDAO.putItemToDB(constants.APP_USER_TABLE, appUser);

        return new SignUpResponse(ageOptin, appUser.id, appUser.deviceID, constants.NO_ERROR, 1,
            legal, appUser.productID, signUpProcess, appUser.userType);
    }

    private initializeInputVariables(input: any): void {
        this.appUserID = input.appUserID;
        this.productID = input.productID;
        this.deviceID = input.deviceID;
        this.registrationType = +input.registrationType;
        this.email = input.email.trim().toLowerCase();
        this.password = input.password;
    }

}
