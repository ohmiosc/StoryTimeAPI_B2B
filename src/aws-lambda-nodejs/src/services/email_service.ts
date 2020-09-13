import {Injectable} from '@nestjs/common';
import {errorResponse, ErrorResponse} from '../responses/error_response';
import {IValidator, validateEmail, validateInput, validateProductIDFormat} from '../lib/validator';
import * as constants from '../constants';
import {MandrillClient} from '../lib/mandrill_client';
import {ValidateEmailResponse, ValidatePasswordResponse} from '../responses/validate_email_response';
import {IVerificationToken, VerificationToken} from '../models/verification_token_model';
import {IAppUser} from '../models/app_user_model';
import {SendEmailResponse} from '../responses/send_email_response';
import {formatCurrentDate} from '../lib/generator';
import {decodeBase64, encodeBase64, encodeMD5} from '../lib/coder';
import {IIsEmailVerifiedResponse, IsEmailVerifiedResponse} from '../responses/is_email_verified_response';
import {AppUserDAO} from '../dao/app_user_dao';
import {VerificationTokenDAO} from '../dao/verification_token_dao';
import {SESEmailSender, SESEmailSenderResponse} from '../lib/ses_email_sender';
import {SendGridEmailSender, SendGridEmailSenderResponse} from '../lib/sendgrid_email_sender';

@Injectable()
export class EmailService {

    private mandrillClient: MandrillClient;
    private sesEmailSender: SESEmailSender;
    private sendGridSender: SendGridEmailSender;

    constructor(private appUserDAO: AppUserDAO, private verificationTokenDAO: VerificationTokenDAO) {
        this.mandrillClient = new MandrillClient();
        this.sesEmailSender = new SESEmailSender();
        this.sendGridSender = new SendGridEmailSender();

    }

    public async validateEmail(input: any): Promise<ValidateEmailResponse | ErrorResponse> {
        const token: string = input.token.trim();
        const email: string = input.email.trim().toLowerCase();

        const encodedEmail = encodeBase64(email);

        const verificationTokenModel: IVerificationToken = await this.verificationTokenDAO.getItemFromDB(
            constants.VERIFICATION_TOKEN_TABLE,
            token,
        );
        const appUser: IAppUser = await this.appUserDAO.getItemByGSI(
            constants.APP_USER_TABLE,
            'email-index',
            'email = :email',
            {':email': encodedEmail},
        );

        if (!verificationTokenModel) {
            return errorResponse(
                constants.NOT_FOUND.statusCode,
                constants.NOT_FOUND.status,
                `Item with ${token} id not found inside ${constants.VERIFICATION_TOKEN_TABLE}`,
            );
        }

        if (!appUser) {
            return errorResponse(
                constants.NOT_FOUND.statusCode,
                constants.NOT_FOUND.status,
                `AppUser with ${email} was not found inside ${constants.APP_USER_TABLE}`,
            );
        }

        if (appUser.isValidated) {
            return new ValidateEmailResponse(constants.EMAIL_ALREADY_VALIDATED, `This email is already validated`);
        }

        if (!verificationTokenModel.active) {
            return new ValidateEmailResponse(constants.TOKEN_NOT_ACTIVE, `This email is not active anymore!`);
        }

        const currentTimeMs = new Date().getTime();
        const tokenExpirationDateMs = new Date(verificationTokenModel.validUntilDate).getTime();

        if (currentTimeMs > tokenExpirationDateMs) {
            const language = appUser.productID.split('-')[1].toUpperCase();
            const decodedEmail = decodeBase64(appUser.email);

            verificationTokenModel.active = false;
            await this.verificationTokenDAO.putItemToDB(constants.VERIFICATION_TOKEN_TABLE, verificationTokenModel);
            await this.sendVerificationEmail(appUser.id, language, decodedEmail, encodedEmail);

            return new ValidateEmailResponse(
                constants.TOKEN_EXPIRED,
                `Current token is expired. New verification email was sent!`,
            );
        }

        appUser.isValidated = 1;
        verificationTokenModel.active = false;

        await this.appUserDAO.putItemToDB(constants.APP_USER_TABLE, appUser);
        await this.verificationTokenDAO.putItemToDB(constants.VERIFICATION_TOKEN_TABLE, verificationTokenModel);

        return new ValidateEmailResponse(constants.NO_ERROR, `Validation succeeded!`);
    }

    public async sendWelcomeEmail(input: any): Promise<SendEmailResponse | ErrorResponse> {
        const inputValidator: IValidator = validateInput(['appUserID', 'deviceID', 'productID'], input);

        if (!inputValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode, constants.BAD_REQUEST.status, inputValidator.message);
        }

        const productValidator: IValidator = validateProductIDFormat(input.productID);

        if (!productValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode, constants.BAD_REQUEST.status, productValidator.message);
        }

        const appUserID = input.appUserID;
        const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, appUserID);

        if (!appUser) {
            return errorResponse(
                constants.NOT_FOUND.statusCode,
                constants.NOT_FOUND.status,
                `AppUser with ${appUserID} id was not found inside ${constants.APP_USER_TABLE}`,
            );
        }

        if (!appUser.email) {
            return errorResponse(
                constants.NOT_FOUND.statusCode,
                constants.NOT_FOUND.status,
                `AppUser with ${appUserID} id has no email`,
            );
        }

        const email = decodeBase64(appUser.email);
        const language = input.productID.split('-')[1].toUpperCase();
        const welcomeTemplate = constants.WELCOME_TEMPLATE_B2B + language;

        await this.mandrillClient.sendMail(constants.WELCOME_EMAIL_SUBJECT, welcomeTemplate, email);

        return new SendEmailResponse(
            appUser.productID,
            appUser.deviceID,
            appUser.id,
            appUser.userType,
            email,
            1,
            'Welcome email was sent',
            constants.NO_ERROR,
        );
    }

    public async validatePassword(input: any): Promise<ValidatePasswordResponse | ErrorResponse> {
        const inputValidator: IValidator = validateInput(['email', 'token', 'password'], input);

        if (!inputValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode, constants.BAD_REQUEST.status, inputValidator.message);
        }

        const token: string = input.token;
        const encodedEmail: string = input.email;
        const password: string = input.email;

        const verificationTokenModel: IVerificationToken = await this.verificationTokenDAO.getItemFromDB(
            constants.VERIFICATION_TOKEN_TABLE,
            token,
        );

        if (!verificationTokenModel) {
            return errorResponse(
                constants.NOT_FOUND.statusCode,
                constants.NOT_FOUND.status,
                `Item with ${token} id not found inside ${constants.VERIFICATION_TOKEN_TABLE}`,
            );
        }

        if (!verificationTokenModel.active) {
            return new ValidatePasswordResponse(constants.TOKEN_NOT_ACTIVE, `This email is not active anymore!`);
        }

        const appUser: IAppUser = await this.appUserDAO.getItemByGSI(
            constants.APP_USER_TABLE,
            'email-index',
            'email = :email',
            {':email': encodedEmail},
        );

        if (!appUser) {
            return errorResponse(
                constants.NOT_FOUND.statusCode,
                constants.NOT_FOUND.status,
                `AppUser with ${encodedEmail} was not found inside ${constants.APP_USER_TABLE}`,
            );
        }

        const currentTimeMs = new Date().getTime();
        const tokenExpirationDateMs = new Date(verificationTokenModel.validUntilDate).getTime();

        if (currentTimeMs > tokenExpirationDateMs) {
            const language = appUser.productID.split('-')[1].toUpperCase();
            const decodedEmail = decodeBase64(appUser.email);

            verificationTokenModel.active = false;
            await this.verificationTokenDAO.putItemToDB(constants.VERIFICATION_TOKEN_TABLE, verificationTokenModel);
            await this.sendResetPasswordEmail(appUser.id, language, decodedEmail, encodedEmail);
            return new ValidatePasswordResponse(
                constants.TOKEN_EXPIRED,
                `Current token is expired. New reset password email was sent!`,
            );
        }

        const encodedPassword = await encodeMD5(password);

        if (!encodedPassword) {
            return errorResponse(
                constants.INTERNAL_SERVER_ERROR.statusCode,
                constants.INTERNAL_SERVER_ERROR.status,
                'Could not decode this password !',
            );
        }

        appUser.password = encodedPassword;
        verificationTokenModel.active = false;

        await this.appUserDAO.putItemToDB(constants.APP_USER_TABLE, appUser);
        await this.verificationTokenDAO.putItemToDB(constants.VERIFICATION_TOKEN_TABLE, verificationTokenModel);

        return new ValidatePasswordResponse(constants.NO_ERROR, `Password reset succeeded!`);
    }

    public async resendVerificationEmail(input: any): Promise<SendEmailResponse | ErrorResponse> {
        const inputValidator: IValidator = validateInput(['appUserID', 'deviceID', 'productID'], input);

        if (!inputValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode, constants.BAD_REQUEST.status, inputValidator.message);
        }

        const productValidator: IValidator = validateProductIDFormat(input.productID);

        if (!productValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode, constants.BAD_REQUEST.status, productValidator.message);
        }

        const appUserID = input.appUserID;
        const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, appUserID);

        if (!appUser) {
            return errorResponse(
                constants.NOT_FOUND.statusCode,
                constants.NOT_FOUND.status,
                `AppUser with ${appUserID} id was not found inside ${constants.APP_USER_TABLE}`,
            );
        }

        if (appUser.isValidated === 1) {
            return new SendEmailResponse(
                appUser.productID,
                appUser.deviceID,
                appUser.id,
                appUser.userType,
                appUser.email,
                0,
                'Email already validate',
                constants.EMAIL_ALREADY_VALIDATED,
            );
        }

        const verificationTokenModels: IVerificationToken[] = await this.verificationTokenDAO.getItemsByGSI(
            constants.VERIFICATION_TOKEN_TABLE,
            'email-index',
            'email = :email',
            {':email': appUser.email},
        );

        if (!verificationTokenModels) {
            return errorResponse(
                constants.NOT_FOUND.statusCode,
                constants.NOT_FOUND.status,
                `Verification token with ${appUser.email} was not found inside ${constants.VERIFICATION_TOKEN_TABLE}`,
            );
        }

        const activeToken = verificationTokenModels.filter(token => token.active)[0];

        if (activeToken) {
            console.log(`Token ${activeToken} was deactivated`);
            activeToken.active = false;
        }

        const language = input.productID.split('-')[1].toUpperCase();
        const decodedEmail = decodeBase64(appUser.email);

        await this.verificationTokenDAO.putItemToDB(constants.VERIFICATION_TOKEN_TABLE, activeToken);
        await this.sendVerificationEmail(appUserID, language, decodedEmail, appUser.email);

        return new SendEmailResponse(
            appUser.productID,
            appUser.deviceID,
            appUser.id,
            appUser.userType,
            appUser.email,
            1,
            'Email was sent',
            constants.NO_ERROR,
        );
    }

    public async resetPassword(input: any): Promise<SendEmailResponse | ErrorResponse> {
        const inputValidator: IValidator = validateInput(['email'], input);

        if (!inputValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode, constants.BAD_REQUEST.status, inputValidator.message);
        }

        const email = input.email;

        const emailValidator: IValidator = validateEmail(email);

        if (!emailValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode, constants.BAD_REQUEST.status, emailValidator.message);
        }

        const encodedEmail = encodeBase64(email);

        const appUser: IAppUser = await this.appUserDAO.getItemByGSI(
            constants.APP_USER_TABLE,
            'email-index',
            'email = :email',
            {':email': encodedEmail},
        );

        if (!appUser) {
            return errorResponse(
                constants.NOT_FOUND.statusCode,
                constants.NOT_FOUND.status,
                `AppUser with ${encodedEmail} email was not found inside ${constants.APP_USER_TABLE}`,
            );
        }

        const verificationTokenModels: IVerificationToken[] = await this.verificationTokenDAO.getItemsByGSI(
            constants.VERIFICATION_TOKEN_TABLE,
            'email-index',
            'email = :email',
            {':email': appUser.email},
        );

        let activeToken = null;
        if (verificationTokenModels) {
            activeToken = verificationTokenModels.filter(token => token.active)[0];
            if (activeToken) {
                console.log(`Token ${activeToken} was deactivated`);
                activeToken.active = false;
            }
        }

        const language = appUser.productID.split('-')[1].toUpperCase();

        if (activeToken) {
            await this.verificationTokenDAO.putItemToDB(constants.VERIFICATION_TOKEN_TABLE, activeToken);
        }

        await this.sendResetPasswordEmail(appUser.id, language, email, encodedEmail);

        return new SendEmailResponse(
            appUser.productID,
            appUser.deviceID,
            appUser.id,
            appUser.userType,
            appUser.email,
            1,
            'Email was sent',
            constants.NO_ERROR,
        );
    }

    public async sendVerificationEmail(appUserID: string, language: string, decodedEmail: string, encodedEmail: string) {
        const verificationEmailTemplate = constants.VALIDATION_TEMPLATE_B2B + language.toUpperCase();
        const token: IVerificationToken = this.createVerificationToken(appUserID, language, encodedEmail);
        const redirectLink: string = `${encodeURIComponent(token.id)}&m=${encodeURIComponent(encodedEmail)}`;

        await this.mandrillClient.sendMail(
            constants.VERIFICATION_EMAIL_SUBJECT,
            verificationEmailTemplate,
            decodedEmail,
            redirectLink,
        );
        await this.verificationTokenDAO.putItemToDB(constants.VERIFICATION_TOKEN_TABLE, token);
    }

    public async sendResetPasswordEmail(appUserID: string, language: string, decodedEmail: string, encodedEmail: string) {
        const resetPasswordTemplate = constants.RESET_PASSWORD_TEMPLATE_B2B + language.toUpperCase();
        const token: IVerificationToken = this.createVerificationToken(appUserID, language, encodedEmail, 'password');
        const redirectLink: string = `${encodeURIComponent(token.id)}&m=${encodeURIComponent(encodedEmail)}`;

        await this.mandrillClient.sendMail(
            constants.RESET_PASSWORD_SUBJECT,
            resetPasswordTemplate,
            decodedEmail,
            redirectLink,
        );
        await this.verificationTokenDAO.putItemToDB(constants.VERIFICATION_TOKEN_TABLE, token);
    }

    public async isEmailVerified(input: any): Promise<IIsEmailVerifiedResponse | ErrorResponse> {
        const inputValidator: IValidator = validateInput(['appUserID', 'deviceID', 'productID'], input);

        if (!inputValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode, constants.BAD_REQUEST.status, inputValidator.message);
        }

        const productValidator: IValidator = validateProductIDFormat(input.productID);

        if (!productValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode, constants.BAD_REQUEST.status, productValidator.message);
        }

        const appUserID = input.appUserID;
        const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, appUserID);

        if (!appUser) {
            return errorResponse(
                constants.NOT_FOUND.statusCode,
                constants.NOT_FOUND.status,
                `AppUser with ${appUserID} was not found inside ${constants.APP_USER_TABLE}`,
            );
        }

        return new IsEmailVerifiedResponse(
            appUser.id,
            appUser.deviceID,
            constants.NO_ERROR,
            appUser.isValidated,
            appUser.productID,
            appUser.userType,
        );
    }

    public async sendContactUsEmail(input: any): Promise<SESEmailSenderResponse | SendGridEmailSenderResponse | ErrorResponse> {
        const inputValidator: IValidator = validateInput(['deviceID', 'appUserID', 'productID', 'appVersion',
            'msgSubject', 'msgaddress', 'msgText'], input);

        if (!inputValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, inputValidator.message);
        }

        const {deviceID, appUserID, productID, appVersion, msgSubject, msgaddress, userName, msgText} = input;
        const emailValidator = validateEmail(msgaddress);

        if (!emailValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
                constants.BAD_REQUEST.status, emailValidator.message);
        }

        const message = this.composeMessage(msgSubject, msgText, userName, msgaddress);
        const subject = msgSubject;

        const response: SendGridEmailSenderResponse = await this.sendGridSender.sendTextEmail(msgaddress,
            constants.CONTACT_US_RECIPIENT_EMAIL, message, subject);

        return response;

    }

    private composeMessage(messageType: string, messageBody: string, recipientName: string, recipientEmail: string) {
        let message = messageBody + '\n';
        message += '\n';
        if (recipientName) {
            message += recipientName + ',' + '\n';
        }
        message += recipientEmail;

        return message;
    }

    private createVerificationToken(
        appUserID: string,
        language: string,
        encodedEmail: string,
        tokenType?: string,
    ): IVerificationToken {
        const currentTimeMs = new Date().getTime();
        const tomorrowsTimeMs = currentTimeMs + 24 * 3600 * 1000;
        const emailType = !tokenType ? 'email' : 'password';

        const verificationToken: IVerificationToken = new VerificationToken();
        verificationToken.active = true;
        verificationToken.email = encodedEmail;
        verificationToken.userid = appUserID;
        verificationToken.language = language;
        verificationToken.type = emailType;
        verificationToken.creationDate = formatCurrentDate(currentTimeMs);
        verificationToken.validUntilDate = formatCurrentDate(tomorrowsTimeMs);

        console.log(`Creating verification token ${JSON.stringify(verificationToken)}`);

        return verificationToken;
    }
}
