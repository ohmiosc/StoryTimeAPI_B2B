import { ISubscriptionHistory } from '../model/subscription_history_model';
import { SubscriptionHistoryDAO } from '../dao/subscription_history_dao';
import * as constants from '../constants';
import { SubscriptionHistoryNew } from '../model/subscription_package_model_new';

export interface ISubscriptionFinderResponse {
  item: ISubscriptionHistory | SubscriptionHistoryNew
  env?: string;
  errorMessage?: string;
}

export class SubscriptionFinder {

  private subscriptionHistoryDao;

  constructor() {
    this.subscriptionHistoryDao = new SubscriptionHistoryDAO();
  }

  public async findSubscriptionByOrderId(orderId: string): Promise<ISubscriptionFinderResponse> {
    let subscriptionHistory: ISubscriptionHistory | SubscriptionHistoryNew;
    let subscriptionFinderResponse: ISubscriptionFinderResponse;
    let subscriptionHistoryTableName = constants.PROD + constants.SUBSCRIPTION_HISTORY_TABLE;
    let currentEnv = constants.PROD;

    try {
      subscriptionHistory = await this.subscriptionHistoryDao.getItemByGSI(subscriptionHistoryTableName, 'transactionID-index',
        'transactionID = :transactionID', { ':transactionID': orderId });

      if (!subscriptionHistory) {
        currentEnv = constants.QA;
        subscriptionHistoryTableName = constants.QA + constants.SUBSCRIPTION_HISTORY_TABLE;
        subscriptionHistory = await this.subscriptionHistoryDao.getItemByGSI(subscriptionHistoryTableName, 'transactionID-index',
          'transactionID = :transactionID', { ':transactionID': orderId });

        if (!subscriptionHistory) {
          currentEnv = constants.DEV;
          subscriptionHistoryTableName = constants.DEV + constants.SUBSCRIPTION_HISTORY_TABLE;
          subscriptionHistory = await this.subscriptionHistoryDao.getItemByGSI(subscriptionHistoryTableName, 'transactionID-index',
            'transactionID = :transactionID', { ':transactionID': orderId });

          if (!subscriptionHistory) {
            subscriptionFinderResponse = { item: null };
            return subscriptionFinderResponse;
          }
        }
      }

      subscriptionFinderResponse = { item: subscriptionHistory, env: currentEnv };
      return subscriptionFinderResponse;

    } catch (e) {
        console.error('ERROR -> ', e.toString());
        subscriptionFinderResponse = { item: null, errorMessage: e.toString()};
        return subscriptionFinderResponse;
    }
  }
}

