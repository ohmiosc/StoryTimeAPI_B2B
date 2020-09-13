import {Injectable} from '@nestjs/common';
import {errorResponse, ErrorResponse} from '../responses/error_response';
import {AppUserDAO} from '../dao/app_user_dao';
import {OperatorDAO} from '../dao/operator_dao';
import {InstallationDAO} from '../dao/installation_dao';
import * as constants from '../constants';
import {IAppUser, Product} from '../models/app_user_model';
import {LoginAlternativeResponse} from '../responses/login_alternative_respose';
import {lambda} from '../config/lamba_config';
import {IInstallation, Installation} from '../models/installation_model';
import {ValidateVoucherResponse} from '../responses/validate_voucher_response';
import {IOperator} from '../models/operator_model';
import {IVoucherValidatorAPIResponse, VoucherValidator} from '../lib/voucher_validator';
import {ISignUpProcess} from '../models/signed_up_process_model';
import {IAgeOptIn} from '../models/age_optin_model';
import {ILegal} from '../models/legal_model';
import {formatCurrentDate} from '../lib/generator';

@Injectable()
export class LoginAlternativeService {
    private XL_OPERATOR = 'xl';
    private voucherValidator;

    constructor(private appUserDao: AppUserDAO,
                private installationDAO: InstallationDAO,
                private operatorDao: OperatorDAO) {
        this.voucherValidator = new VoucherValidator();
    }

    public async loginAlternative(input: any): Promise<LoginAlternativeResponse | ErrorResponse> {
        const appUser = await this.appUserDao.getItemFromDB(constants.APP_USER_TABLE, input.appUserID);
        if (!appUser) {
            return errorResponse(constants.NOT_FOUND.statusCode, constants.NOT_FOUND.status,
                `User with id: ${input.appUserID} not found`);
        }
        const operator = await this.operatorDao.getItemFromDBByKey(constants.OPERATOR_TABLE, {operatorName: input.operatorName.toLowerCase()});
        const currentOperator = appUser.operatorsList.find(billingOperator => {
            return billingOperator.operatorType.toLowerCase() === input.operatorName.toLowerCase();
        });

        if (!currentOperator) {
            return errorResponse(constants.NOT_FOUND.statusCode, constants.NOT_FOUND.status,
                `Billing operator ${input.operatorName} not found for this user, ${JSON.stringify(appUser.operatorsList)}`);
        }

        const operatorCountry = operator.operatorCountries.find(country => {
            return country.siteID === currentOperator.siteID;
        });

        if (!operatorCountry) {
            return errorResponse(constants.NOT_FOUND.statusCode, constants.NOT_FOUND.status,
                `Operator country with ${currentOperator.siteID} not found`);
        }

        const msisdnWithCode = operatorCountry.operatorCode + input.MSISDN;

        let currentAppUser: IAppUser;
        let isUserAlreadyExists = false;

        if (appUser.signUpProcess === 0 && appUser.userType === constants.ALTERNATIVE_GUEST) {
            console.log('User is Alternative guest and not signed up');
            const appUserByMSISDN = await this.appUserDao.getItemByGSI(constants.APP_USER_TABLE, 'MSISDN-index',
                'msisdn = :msisdn', {':msisdn': msisdnWithCode});

            if (appUserByMSISDN) {
                console.log('Found existing user by MSISDN ' + appUserByMSISDN);
                console.log('Setting new deviceID ' + input.deviceID + ' to existing user');
                console.log('Setting registeredOperatorName ' + input.operatorName + ' to existing user');
                appUserByMSISDN.deviceID = input.deviceID;
                appUserByMSISDN.platform = input.platform;
                currentAppUser = appUserByMSISDN;
                isUserAlreadyExists = true;
                console.log('Current user = ' + currentAppUser);
            }
        }

        if (isUserAlreadyExists && currentOperator.operatorType === this.XL_OPERATOR) {
            console.log('Found user by MSISDN =  ' + currentAppUser.msisdn + ' with ' + currentOperator.operatorType + ' operator');
            return new LoginAlternativeResponse(currentAppUser.id, currentAppUser.productID, currentAppUser.deviceID, currentAppUser.userType,
                currentAppUser.isLegalSigned, currentAppUser.legalDate, currentAppUser.ageOptin, currentAppUser.ageOptinDate,
                currentAppUser.signUpProcess, currentAppUser.signUpProcessDate, constants.NO_ERROR, 1);
        }

        if (!isUserAlreadyExists) {
            console.log('Existing user with such MSISDN does not exist ');
            console.log('Create MSISDN with code for new user');
            currentAppUser = appUser;
            console.log('Current user = ' + currentAppUser);
        }

        if (!isUserAlreadyExists && input.operatorName === this.XL_OPERATOR) {
            console.log('User with MSISDN =  ' + msisdnWithCode + ' and operator name =  ' + currentOperator.operatorType + ' was not found');
            return new LoginAlternativeResponse(currentAppUser.id, currentAppUser.productID, currentAppUser.deviceID, currentAppUser.userType,
                currentAppUser.isLegalSigned, currentAppUser.legalDate, currentAppUser.ageOptin, currentAppUser.ageOptinDate,
                currentAppUser.signUpProcess, currentAppUser.signUpProcessDate, constants.NO_ERROR, 1);
        }

        const mySQLRequestBody = {
            MSISDN: msisdnWithCode,
            siteID: operatorCountry.siteID,
            operatorName: input.operatorName,
            productID: currentAppUser.productID,
            deviceID: currentAppUser.deviceID,
            appUserID: currentAppUser.id
        };
        console.log('Getting user state from MySQL with mySQLRequestBody = ' + mySQLRequestBody);
        const mySQLResponseBody = await this.getUserStateFromMySQL(mySQLRequestBody);
        const mySQLResponse = JSON.parse(mySQLResponseBody.Payload);
        console.log('Response from MySQL suchka = ', mySQLResponse);
        const subscriptionState = mySQLResponse.state;
        if (!subscriptionState || subscriptionState === -1) {
            if (isUserAlreadyExists) {
                console.log('Delete guest user from DB' + appUser.toString());
                await this.appUserDao.deleteItemFromBD(constants.APP_USER_TABLE, appUser.id);
                await this.updateInstallationInDB(currentAppUser.id, appUser.id);
            }
            console.log('Update current user in DB ',  currentAppUser);
            await this.appUserDao.putItemToDB(constants.APP_USER_TABLE, currentAppUser);

            return new LoginAlternativeResponse(currentAppUser.id, currentAppUser.productID, currentAppUser.deviceID, currentAppUser.userType,
                currentAppUser.isLegalSigned, currentAppUser.legalDate, currentAppUser.ageOptin, currentAppUser.ageOptinDate,
                currentAppUser.signUpProcess, currentAppUser.signUpProcessDate, constants.INCORRECT_MSISDN, 0);
        }
        // FIX - ARTURO GALVEZ 28/08  INI
        console.log('subscriptionState : ' , subscriptionState);
        if (subscriptionState && (subscriptionState === 5  ||  subscriptionState === 6)      ){
            console.log('Enter to Logic of user suspend or canceled , msisdn : ' , msisdnWithCode);
            currentAppUser.userType = subscriptionState;
            currentAppUser.msisdn = msisdnWithCode;
            currentAppUser.registeredOperatorName = input.operatorName;
            currentAppUser.mySqlID = mySQLResponse.userID;
            currentAppUser.userType = subscriptionState;

            const failureReason = this.defineFailureReason(subscriptionState);
            const isSucceeded = failureReason === constants.NO_ERROR ? 1 : 0;

            await this.appUserDao.putItemToDB(constants.APP_USER_TABLE, currentAppUser);

            return new LoginAlternativeResponse(currentAppUser.id, currentAppUser.productID, currentAppUser.deviceID, currentAppUser.userType,
                currentAppUser.isLegalSigned, currentAppUser.legalDate, currentAppUser.ageOptin, currentAppUser.ageOptinDate,
                currentAppUser.signUpProcess, currentAppUser.signUpProcessDate, failureReason, isSucceeded);
        }
        // FIX - ARTURO GALVEZ 28/08  FIN

        const nextModifiedDate: string = mySQLResponse.nextModifiedDate;
        const lastModifiedDate: string = mySQLResponse.lastModifiedDate;

        if (nextModifiedDate) {
            // Date validUntil = getCurrentTimeStamp(nextModifiedDate);
            // Date subscriptionStart = getCurrentTimeStamp(lastModifiedDate);

            console.log('Subscription start = ' + lastModifiedDate);
            console.log('Valid until = ' + nextModifiedDate);

            let appUserProducts = currentAppUser.products;
            console.log('AppUser products ' + appUserProducts);

            if (!appUserProducts || appUserProducts == null || appUserProducts.length < 1) {
                console.log('Product list is empty');
                appUserProducts = [];
            }

            console.log('filing up product list');
            appUserProducts = this.fillUpProductList(input.productID, input.deviceID, lastModifiedDate, nextModifiedDate, subscriptionState, appUserProducts);
            currentAppUser.products = appUserProducts;
        }

        const failureReason = this.defineFailureReason(subscriptionState);
        const isSucceeded = failureReason === constants.NO_ERROR ? 1 : 0;

        if (isUserAlreadyExists) {
            console.log('Delete guest user from DB' + appUser.toString());
            await this.appUserDao.deleteItemFromBD(constants.APP_USER_TABLE, appUser.id);
            this.updateInstallationInDB(currentAppUser.id, appUser.id);
        }

        currentAppUser.mySqlID = mySQLResponse.userID;
        currentAppUser.userType = subscriptionState;

        if (subscriptionState === constants.ALTERNATIVE_CANCELLED ||
            subscriptionState === constants.ALTERNATIVE_DISABLED ||
            subscriptionState === constants.ALTERNATIVE_SUBSCRIBED) {
            currentAppUser.msisdn = msisdnWithCode;
        }

        currentAppUser.signUpProcess = 1;
        currentAppUser.signUpProcessDate = new Date().toString();
        currentAppUser.registeredOperatorName = input.operatorName;
        currentAppUser.userType = constants.ALTERNATIVE_SUBSCRIBED;
        currentAppUser.msisdn = msisdnWithCode;

        console.log('Update current user in DB ' + currentAppUser.toString());
        await this.appUserDao.putItemToDB(constants.APP_USER_TABLE, currentAppUser);

        return new LoginAlternativeResponse(currentAppUser.id, currentAppUser.productID, currentAppUser.deviceID, currentAppUser.userType,
            currentAppUser.isLegalSigned, currentAppUser.legalDate, currentAppUser.ageOptin, currentAppUser.ageOptinDate,
            currentAppUser.signUpProcess, currentAppUser.signUpProcessDate, failureReason, isSucceeded);
    }

    public async validateVoucher(input: any): Promise<ValidateVoucherResponse | ErrorResponse> {
        const {deviceID, appUserID, operatorName, MSISDN, voucher, platform, productID} = input;

        if (operatorName.toLowerCase() !== this.XL_OPERATOR.toLocaleLowerCase()) {
            return new ValidateVoucherResponse(constants.BAD_REQUEST.status,
                constants.BAD_REQUEST.statusCode, 'Wrong operator name. Should be xl.');
        }

        const appUser: IAppUser = await this.appUserDao.getItemFromDB(constants.APP_USER_TABLE, appUserID);

        if (!appUser) {
            return new ValidateVoucherResponse(constants.NOT_FOUND.status,
                constants.NOT_FOUND.statusCode, `User with id ${appUserID} not found inside ${constants.APP_USER_TABLE}`);
        }

        const operator: IOperator = await this.operatorDao.getItemFromDBByKey(constants.OPERATOR_TABLE, {operatorName: input.operatorName.toLowerCase()});

        if (!operator) {
            return new ValidateVoucherResponse(constants.NOT_FOUND.status,
                constants.NOT_FOUND.statusCode, `Operator with id ${operatorName} not found inside ${constants.OPERATOR_TABLE}`);
        }

        const operatorCode = operator.operatorCountries[0].operatorCode;
        const msisdnWithCode = operatorCode + MSISDN;

        console.log('msisdn with code --> ', msisdnWithCode);

        const validateVoucherAPIResponse: IVoucherValidatorAPIResponse =
            await this.voucherValidator.validateVoucher(msisdnWithCode, voucher, operatorName.toUpperCase());

        const signUpProcess: ISignUpProcess = {isSigned: appUser.signUpProcess, date: appUser.signUpProcessDate};
        const ageOptIn: IAgeOptIn = {isSigned: appUser.ageOptin, date: appUser.ageOptinDate};
        const legal: ILegal = {isSigned: appUser.isLegalSigned, date: appUser.legalDate};

        if (validateVoucherAPIResponse.status !== constants.OK.statusCode) {
            return new ValidateVoucherResponse(constants.OK.status, constants.OK.statusCode, `Voucher ${voucher} is not valid`,
                ageOptIn, appUser.id, appUser.deviceID, constants.VOUCHER_VALIDATION_FAILED, 0, legal, appUser.productID,
                signUpProcess, appUser.userType);
        }

        const currentDate = formatCurrentDate(new Date().getTime());

        appUser.msisdn = msisdnWithCode;
        appUser.deviceID = deviceID;
        appUser.userType = constants.ALTERNATIVE_SUBSCRIBED;
        appUser.signUpProcess = 1;
        appUser.signUpProcessDate = currentDate;

        signUpProcess.isSigned = 1;
        signUpProcess.date = currentDate;

        await this.appUserDao.putItemToDB(constants.APP_USER_TABLE, appUser);

        return new ValidateVoucherResponse(constants.OK.status, constants.OK.statusCode, `Voucher ${voucher} is valid`,
            ageOptIn, appUser.id, appUser.deviceID, constants.NO_ERROR, 1, legal, appUser.productID,
            signUpProcess, appUser.userType);

    }

    protected defineFailureReason(subscriptionState: number): number {
        let failureReason = 0;
        if (subscriptionState === constants.ALTERNATIVE_CANCELLED) {
            failureReason = constants.CANCELLED_USER;
        }

        if (subscriptionState === constants.ALTERNATIVE_DISABLED) {
            failureReason = constants.DISABLED_USER;
        }

        if (subscriptionState === constants.ALTERNATIVE_SUBSCRIBED) {
            failureReason = constants.NO_ERROR;
        }

        return failureReason;
    }

    protected fillUpProductList(productID: string, deviceID: string, subscriptionStart: string,
                                validUntil: string, subscriptionState: number, products: any[]) {
        const appUserProduct = new Product(productID, deviceID, subscriptionStart, subscriptionState, null, null, validUntil);

        if (products.length === 0) {
            products.push(appUserProduct);
            return products;
        }

        products.forEach(product => {
            if (product.id === productID) {
                product.deviceID = deviceID,
                    product.productID = productID,
                    product.subscriptionStart = subscriptionStart,
                    product.validUntil = validUntil;
            } else {
                products.push(appUserProduct);
            }
        });

        return products;
    }

    protected getUserStateFromMySQL(sqlRequest: object): any {
        const params = {
            FunctionName: 'getUserState_fromMysql:' + constants.ENV,
            Payload: JSON.stringify(sqlRequest)
        };

        return lambda.invoke(params).promise();
    }

    protected async updateInstallationInDB(existingInstallationId: string, newInstallationId: string): Promise<void> {
        try {
            console.log('Updating installation information ...');
            const newInstallationInfo = await this.installationDAO.getItemFromDB(constants.INSTALLATION_TABLE, newInstallationId);
            let existingInstallation = await this.installationDAO.getItemFromDB(constants.INSTALLATION_TABLE, existingInstallationId);
            existingInstallation = this.updateInstallationInfo(existingInstallation, newInstallationInfo);
            console.log('Deleting extra installation info  from DB' + newInstallationInfo.toString());
            await this.installationDAO.deleteItemFromBD(constants.INSTALLATION_TABLE, newInstallationInfo.id);
            console.log('Updating existing installation in DB ' + existingInstallation.toString());
            await this.installationDAO.putItemToDB(constants.INSTALLATION_TABLE, existingInstallation);
        } catch (e) {
            console.error(e);
        }
    }

    protected updateInstallationInfo(existingInstallation: IInstallation, newInstallationInfo: IInstallation) {
        console.log('Filling up installation list...');
        let existingInstallationHistory = existingInstallation.installationHistory;

        if (!existingInstallationHistory) {
            console.log('Installation history list is empty');
            existingInstallationHistory = [];
        }

        const historyInstallationInfo = new Installation(existingInstallation.appVersion, existingInstallation.country, existingInstallation.deviceAdvertisingID,
            existingInstallation.deviceManufacturer, existingInstallation.deviceModel, existingInstallation.id, existingInstallation.installationDate,
            existingInstallation.installationHistory, existingInstallation.language, existingInstallation.marketingReferral, existingInstallation.productID);

        existingInstallationHistory.push(historyInstallationInfo);

        console.log('Updating installation ...');
        console.log('Existing installation = ' + existingInstallation.toString());
        console.log('New installation = ' + newInstallationInfo.toString());

        existingInstallation.productID = newInstallationInfo.productID;
        existingInstallation.installationDate = new Date().toString();
        existingInstallation.marketingReferral = newInstallationInfo.marketingReferral;
        existingInstallation.deviceManufacturer = newInstallationInfo.deviceManufacturer;
        existingInstallation.deviceModel = newInstallationInfo.deviceModel;
        existingInstallation.language = newInstallationInfo.language;
        existingInstallation.country = newInstallationInfo.country;
        existingInstallation.deviceAdvertisingID = newInstallationInfo.deviceAdvertisingID;
        existingInstallation.appVersion = newInstallationInfo.appVersion;
        existingInstallation.installationHistory = existingInstallationHistory;

        return existingInstallation;
    }

}
