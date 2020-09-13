import { StoreResponse } from '../response/store_response';
import * as constants from '../constants';
import { ISubscriptionFinderResponse, SubscriptionFinder } from '../lib/subscription_finder';
import { Injectable } from '@nestjs/common';
import { AppUserDAO } from '../dao/app_user_dao';
import { SubscriptionHistoryDAO } from '../dao/subscription_history_dao';
import { IAppUser } from '../model/app_user_model';
import { formatCurrentDate } from '../lib/date_support';
import { TransactionDAO } from '../dao/transaction_dao';
import { TransactionModel } from '../model/transaction_model';
import { SubscriptionHistoryNew } from '../model/subscription_package_model_new';
import { SubscriptionHistoryDAONew } from '../dao/subscription_history_dao_new';

@Injectable()
export class AppStoreService {

  private subscriptionsFinder: SubscriptionFinder;


  constructor(private appUserDao: AppUserDAO,
              private subscriptionHistoryDao: SubscriptionHistoryDAO,
              private transactionDAO: TransactionDAO,
              private subscriptionHistoryDaoNew: SubscriptionHistoryDAONew) {
    this.subscriptionsFinder = new SubscriptionFinder();
  }

  public async handleAppleNotification(input: any): Promise<StoreResponse> {

    const notificationType = input.notification_type;

    if (!notificationType) {
      return new StoreResponse(constants.BAD_REQUEST.statusCode, `Wrong receipt type`);

    }

    if (notificationType === constants.APPLE_RENEW) {

      const {
        purchase_date_ms, is_in_intro_offer_period, unique_identifier, original_transaction_id, expires_date,
        transaction_id, quantity, web_order_line_item_id,
        unique_vendor_identifier, item_id, product_id, is_trial_period, bid, bvrs
      } = input.latest_receipt_info;
      const purchaseToken = input.latest_receipt;
      const subscriptionFinderResponse: ISubscriptionFinderResponse = await this.subscriptionsFinder.findSubscriptionByOrderId(original_transaction_id);

      if (!subscriptionFinderResponse.item) {
        console.error('ERROR -> ', `Could not find subscription by orderId =  ${original_transaction_id}`);
        return new StoreResponse(constants.OK.statusCode, `Could not find subscription by orderId =  ${original_transaction_id}`);
      }
      const env = subscriptionFinderResponse.env;

      const currentDate: string = formatCurrentDate(new Date().getTime());
      const purchaseDate: string = formatCurrentDate(purchase_date_ms);
      const expirationDate: string = formatCurrentDate(expires_date);


      const subscription: any = subscriptionFinderResponse.item;
      let appUser: IAppUser = await this.appUserDao.getItemFromDB(env + constants.APP_USER_TABLE, subscription.id);

      if (!appUser) {
        appUser = await this.appUserDao.getItemFromDB(env + constants.APP_USER_TABLE, subscription.appUserID);
      }

      if (!appUser) {
        console.error('ERROR -> ', `Could not find appUser for subscription with id = ${subscription.id}`);
        return new StoreResponse(constants.OK.statusCode, `Could not find appUser for subscription with id = ${subscription.id}`);
      }

      const subscriptionHistoryNew: SubscriptionHistoryNew = new SubscriptionHistoryNew(appUser.deviceID, appUser.productID, appUser.id, appUser.platform, constants.APP_STORE_ID, currentDate,
        appUser.sessionID, appUser.appVersion, product_id, transaction_id, undefined, undefined, purchaseDate, expirationDate, constants.APPLE_RENEW, purchaseToken,
        bid, is_trial_period, input.auto_renew_status, undefined);

      const transaction: TransactionModel = new TransactionModel(appUser.id, appUser.appVersion, undefined, appUser.deviceID, expirationDate,
        undefined, appUser.productID, product_id, purchaseDate, constants.APP_STORE_ID, purchaseDate, transaction_id, notificationType, currentDate, undefined);


      appUser.subscriptionExpirationDate = expirationDate;

      await this.appUserDao.putItemToDB(env + constants.APP_USER_TABLE, appUser);
      await this.subscriptionHistoryDaoNew.putItemToDB(env + constants.SUBSCRIPTION_HISTORY_TABLE, subscriptionHistoryNew);
      await this.transactionDAO.putItemToDB(env + constants.TRANSACTION_TABLE, transaction);

    }

    return new StoreResponse(constants.OK.statusCode);
  }
}

