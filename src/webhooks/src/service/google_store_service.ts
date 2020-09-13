import { GoogleAPI } from '../lib/google_api';
import { StoreResponse } from '../response/store_response';
import * as constants from '../constants';
import { ISubscriptionFinderResponse, SubscriptionFinder } from '../lib/subscription_finder';
import { Injectable } from '@nestjs/common';
import { AppUserDAO } from '../dao/app_user_dao';
import { SubscriptionHistoryDAO } from '../dao/subscription_history_dao';
import { AppUserTypeHistoryDAO } from '../dao/app_user_type_history_dao';
import { IAppUser } from '../model/app_user_model';
import { formatCurrentDate } from '../lib/date_support';
import { TransactionModel } from '../model/transaction_model';
import { TransactionDAO } from '../dao/transaction_dao';
import { SubscriptionHistoryNew } from '../model/subscription_package_model_new';
import { SubscriptionHistoryDAONew } from '../dao/subscription_history_dao_new';
import AppsflyerService from '../lib/appsflyer_service';

@Injectable()
export class GoogleStoreService {

  private googleAPI: GoogleAPI;
  private subscriptionsFinder: SubscriptionFinder;
  private appsFlyerService: AppsflyerService;



  constructor(private appUserDao: AppUserDAO,
              private subscriptionHistoryDao: SubscriptionHistoryDAO,
              private subscriptionHistoryDaoNew: SubscriptionHistoryDAONew,
              private appUserTypeHistoryDao: AppUserTypeHistoryDAO,
              private transactionDAO: TransactionDAO) {
    this.googleAPI = new GoogleAPI();
    this.subscriptionsFinder = new SubscriptionFinder();
    this.appsFlyerService = new AppsflyerService();
  }

  public async handleAndroidNotification(input: any): Promise<StoreResponse> {
    const message = Buffer.from(input.message.data, 'base64').toString('utf-8');
    const body = JSON.parse(message);

    console.log('Body', JSON.stringify(body));

    if (body.testNotification) {
      console.log('Test message');
      return new StoreResponse(constants.OK.statusCode);
    }

    const { notificationType, purchaseToken, subscriptionId } = body.subscriptionNotification;
    const packageName = body.packageName;

    if (notificationType === constants.GOOGLE_RENEW || notificationType === constants.GOOGLE_CANCELLATION) {

      const googleReceipt = await this.googleAPI.getGoogleReceiptV3(packageName,
        subscriptionId, purchaseToken);

      console.log('Google receipt -> ', googleReceipt);

      if (!googleReceipt) {
        console.error('ERROR -> ', `Could not get google receipt for purchaseToken =  ${purchaseToken}`);
        return new StoreResponse(constants.BAD_REQUEST.statusCode, `Could not get google receipt for purchaseToken = ${purchaseToken}`);
      }

      const {
        kind, startTimeMillis, expiryTimeMillis, autoRenewing, priceCurrencyCode,
        priceAmountMicros, countryCode, developerPayload, paymentState, purchaseType,
        cancelReason, userCancellationTimeMillis, cancelSurveyResult
      } = googleReceipt;

      const orderId = this.parseOrderId(googleReceipt.orderId);
      const subscriptionFinderResponse: ISubscriptionFinderResponse = await this.subscriptionsFinder.findSubscriptionByOrderId(orderId);

      if (!subscriptionFinderResponse.item) {
        console.error('ERROR -> ', `Could not find subscription by orderId =  ${orderId}`);
        return new StoreResponse(constants.OK.statusCode, `Could not find subscription by orderId =  ${orderId}`);
      }

      const env = subscriptionFinderResponse.env;
      const currentDate: string = formatCurrentDate(new Date().getTime());
      const expirationDate: string = formatCurrentDate(expiryTimeMillis);
      const purchaseDate: string = notificationType === constants.GOOGLE_RENEW ? currentDate : undefined;
      const notification: string = notificationType === constants.GOOGLE_RENEW ? 'RENEWAL' : 'CANCELLATION';
      const eventName: string = notificationType === constants.GOOGLE_RENEW ? 'af_renewal' : 'af_cancel';
      const cancellationDate: string = notificationType === constants.GOOGLE_RENEW ? undefined : currentDate;
      const developerPayloadJSON = JSON.parse(developerPayload);
      const isFreeTrial = developerPayloadJSON.is_free_trial;

      const subscription: any = subscriptionFinderResponse.item;
      let appUser: IAppUser = await this.appUserDao.getItemFromDB(env + constants.APP_USER_TABLE, subscription.id);

      if (!appUser) {
        appUser = await this.appUserDao.getItemFromDB(env + constants.APP_USER_TABLE, subscription.appUserID);
      }

      if (!appUser) {
        console.error('ERROR -> ', `Could not find appUser for subscription with id = ${subscription.id}`);
        return new StoreResponse(constants.OK.statusCode, `Could not find appUser for subscription with id = ${subscription.id}`);
      }

      const price = this.parsePriceMacros(priceCurrencyCode, priceAmountMicros);
      const appsFlyerPrice = notificationType === constants.GOOGLE_RENEW ? price : undefined;
      const appsFlyerCurrency = notificationType === constants.GOOGLE_RENEW ? priceCurrencyCode : undefined;



      const subscriptionHistoryNew: SubscriptionHistoryNew = new SubscriptionHistoryNew(appUser.deviceID, appUser.productID, appUser.id, appUser.platform, constants.GOOGLE_PLAY_ID,
        currentDate, appUser.sessionID, appUser.appVersion, subscriptionId, googleReceipt.orderId, priceCurrencyCode, price, purchaseDate, expirationDate, notification, purchaseToken,
        packageName, isFreeTrial, autoRenewing, orderId, cancelReason, cancellationDate, cancelSurveyResult);

      const transaction: TransactionModel = new TransactionModel(appUser.id, appUser.appVersion, priceCurrencyCode, appUser.deviceID, expirationDate, price,
        appUser.productID, subscriptionId, purchaseDate, constants.GOOGLE_PLAY_ID, currentDate, googleReceipt.orderId, notification, currentDate, orderId);

      appUser.subscriptionExpirationDate = expirationDate;

      await this.appUserDao.putItemToDB(env + constants.APP_USER_TABLE, appUser);
      await this.subscriptionHistoryDaoNew.putItemToDB(env + constants.SUBSCRIPTION_HISTORY_TABLE, subscriptionHistoryNew);
      await this.transactionDAO.putItemToDB(env + constants.TRANSACTION_TABLE, transaction);
      await this.appsFlyerService.sendAppsflyerEvent(eventName, appsFlyerPrice, appsFlyerCurrency, packageName, appUser.appsFlyerID, 'android');
    }

    return new StoreResponse(constants.OK.statusCode);
  }

  private parseOrderId(orderId: string): string {
    const orderIdArr = orderId.split('..');
    const response = orderIdArr.length > 1 ? orderIdArr[0] : orderId;
    return response;
  }


  private parsePriceMacros(currencyCode: string, priceMacros: any): string {
    const divider = 1000000;
    const priceNumber: number = typeof 'string' ? parseInt(priceMacros, 10) : priceMacros;
    return priceNumber / divider + ' ' + currencyCode;
  }

}

