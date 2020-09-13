import { errorResponse, ErrorResponse } from '../responses/error_response';
import { Injectable } from '@nestjs/common';
import { AppUserDAO } from '../dao/app_user_dao';
import { SubscriptionHistoryDAO } from '../dao/subscription_history_dao';
import * as constants from '../constants';
import { IAPReceiptResponse} from '../responses/iap_receipt_response';
import { isEmpty, IValidator, validateInput } from '../lib/validator';
import { IAppUser } from '../models/app_user_model';
import { IReceipt, ISubscriptionPackage } from '../models/subscription_package_model';
import { ISubscriptionData } from '../models/subscription_data_model';
import { ISubscriptionHistory, SubscriptionHistory } from '../models/subscription_history_model';
import { AppleReceiptValidator } from '../lib/apple_receipt_validator';
import { formatCurrentDate } from '../lib/generator';
import { parseAndroidReceipt } from '../lib/parser';
import { GoogleReceiptValidator } from '../lib/google_receipt_validator';

@Injectable()
export class StoreService {

  private APP_STORE_ID = 1;
  private GOOGLE_PLAY_ID = 2;

  private appleValidator;
  private googleValidator;

  constructor(private appUserDAO: AppUserDAO,
              private subscriptionHistoryDAO: SubscriptionHistoryDAO) {

    this.appleValidator = new AppleReceiptValidator();
    this.googleValidator = new GoogleReceiptValidator();
  }

  public async sendIAPReceipt(input: any): Promise<IAPReceiptResponse | ErrorResponse> {
    const inputValidator: IValidator = validateInput(['productID', 'deviceID', 'appUserID',
      'appsFlyerID', 'package'], input);

    if (!inputValidator.isValid) {
      return errorResponse(constants.BAD_REQUEST.statusCode,
        constants.BAD_REQUEST.status, inputValidator.message);
    }

    const response = new IAPReceiptResponse();
    response.isSucceeded = 0;

    const appUserID = input.appUserID;
    const product = input.productID;
    const deviceID = input.deviceID;
    const platform = input.platform;
    const sessionID = input.sessionID;
    const appVersion = input.appVersion;
    const appsFlyerID = input.appsFlyerID;

    const subscriptionPackage: ISubscriptionPackage = input.package;

    let receipt: IReceipt;

    try {
      receipt = JSON.parse(subscriptionPackage.receipt.toString());
    } catch (e) {
      console.log(`Receipt is not JSON string ${e.toString()}`);
      receipt = subscriptionPackage.receipt;
    }

    const storeID: number = subscriptionPackage.storeID;

    if (!receipt) {
      console.log(`Missing receipt`);
      response.failureReason = constants.RECEIPT_IS_EMPTY_ERROR;
      return response;
    }

    console.log(`Receipt = ${JSON.stringify(receipt)}`);

    const payload: string = receipt.Payload;

    if (!storeID || storeID < this.APP_STORE_ID || storeID > this.GOOGLE_PLAY_ID) {
      console.log(`Incorrect storeID ${storeID}`);
      response.failureReason = constants.INCORRECT_STORE_ID_ERROR;
      return response;
    }

    if (storeID === this.APP_STORE_ID) {
      console.log(`Apple Receipt`);
      const isReceiptValid = await this.appleValidator.isAppStoreReceiptValid(payload);
      console.log(`Is App Store receipt valid = ${isReceiptValid}`);

      if (!isReceiptValid) {
        response.failureReason = 'Apple validation failed';
        return response;
      }
    } else {
      console.log(`Google receipt`);

      const androidReceipt = parseAndroidReceipt(receipt.Payload);

      console.log(`Android receipt = ${JSON.stringify(androidReceipt)}`);

      const packageName = androidReceipt.json.packageName;
      const subscriptionId = androidReceipt.json.productId;
      const purchaseToken = androidReceipt.json.purchaseToken;

      const isAndroidReceiptValid = await this.googleValidator.isGooglePlayReceiptValid(packageName, subscriptionId, purchaseToken);

      if (!isAndroidReceiptValid) {
        response.failureReason = 'Google validation failed';
        return response;
      }
    }

    const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, appUserID);

    if (!appUser) {
      return errorResponse(constants.NOT_FOUND.statusCode, constants.NOT_FOUND.status,
        `Item with ${appUserID} not found inside ${constants.APP_USER_TABLE}`);
    }

    console.log(`Generating current package ${JSON.stringify(subscriptionPackage)}`);

    const subscriptionData: ISubscriptionData = subscriptionPackage.subscriptionData;
    console.log(`Generating new Subscription Data ${JSON.stringify(subscriptionData)}`);

    let subscriptionHistory: ISubscriptionHistory = await
      this.subscriptionHistoryDAO.getItemFromDB(constants.SUBSCRIPTION_HISTORY_TABLE, appUserID);

    if (!subscriptionHistory) {
      subscriptionHistory = new SubscriptionHistory();
      subscriptionHistory.id = appUserID;
    }

    const purchaseDate = isEmpty(subscriptionPackage.purchaseDate) ? formatCurrentDate(new Date().getTime()) : subscriptionPackage.purchaseDate;
    const expireDate = isEmpty(subscriptionData.expireDate) ? undefined : subscriptionData.expireDate;
    const remainingTime = isEmpty(subscriptionData.remainingTime) ? undefined : subscriptionData.remainingTime;
    const introductoryPricePeriod = isEmpty(subscriptionData.introductoryPricePeriod) ? undefined : subscriptionData.introductoryPricePeriod;
    const introductoryPrice = isEmpty(subscriptionData.introductoryPrice) ? undefined : subscriptionData.introductoryPrice;

    subscriptionHistory.productID = product;
    subscriptionHistory.deviceID = deviceID;
    subscriptionHistory.platform = platform;
    subscriptionHistory.store = storeID;
    subscriptionHistory.sessionID = sessionID;
    subscriptionHistory.appVersion = appVersion;
    subscriptionHistory.productName = subscriptionPackage.productID;
    subscriptionHistory.transactionID = subscriptionPackage.transactionID;
    subscriptionHistory.localCurrency = subscriptionPackage.isoCurrencyCode;
    subscriptionHistory.localPrice = subscriptionPackage.localizedPrice;
    subscriptionHistory.purchaseDate = purchaseDate;
    subscriptionHistory.expirationDate = expireDate;

    subscriptionData.remainingTime = remainingTime;
    subscriptionData.introductoryPricePeriod = introductoryPricePeriod;
    subscriptionData.introductoryPrice = introductoryPrice;
    subscriptionData.expireDate = expireDate;

    subscriptionPackage.purchaseDate = purchaseDate;

    const subscriptions: ISubscriptionPackage[] = !subscriptionHistory.subscriptions ? [] : subscriptionHistory.subscriptions;
    subscriptions.push(subscriptionPackage);
    subscriptionHistory.subscriptions = subscriptions;

    appUser.userType = constants.IAP_SUBSCRIBED;
    appUser.appsFlyerID = appsFlyerID;
    appUser.productName = subscriptionPackage.productID;
    appUser.subscriptionExpirationDate = expireDate;

    await this.subscriptionHistoryDAO.putItemToDB(constants.SUBSCRIPTION_HISTORY_TABLE, subscriptionHistory);
    await this.appUserDAO.putItemToDB(constants.APP_USER_TABLE, appUser);

    response.appUserID = appUserID;
    response.deviceID = deviceID;
    response.productID = product;
    response.userType = appUser.userType;
    response.failureReason = constants.NO_ERROR;
    response.isSucceeded = 1;

    return response;
  }

}
