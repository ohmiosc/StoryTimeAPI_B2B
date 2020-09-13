import { ICancelSurveyResult } from './subscription_package_model';

const uuidv1 = require('uuid/v1');

export class SubscriptionHistoryNew{

  private id: string;
  private deviceID: string;
  private productID: string;
  private appUserID: string;
  private platform?: string;
  private store?: number;
  private creationDate?: string;
  private sessionID?: string;
  private appVersion?: string;
  private productName?: string;
  private transactionID?: string;
  private localCurrency?: string;
  private localPrice?: string;
  private purchaseDate?: string;
  private expirationDate?: string;
  private notificationType?: string;
  private purchaseToken?: string;
  private packageName?: string;
  private isFreeTrial?: boolean;
  private autoRenewing?: boolean;
  private cancelReason?: string;
  private cancellationDate?: string;
  private initialPurchaseID?: string;
  cancelSurveyResult?: ICancelSurveyResult;

  constructor(deviceID: string, productID: string, appUserID: string, platform: string, store: number,
              creationDate: string, sessionID: string, appVersion: string, productName: string,
              transactionID: string, localCurrency: string, localPrice: string, purchaseDate: string,
              expirationDate: string, notificationType: string, purchaseToken: string,
              packageName: string, isFreeTrial: boolean, autoRenewing: boolean, initialPurchaseID: string,
              cancelReason?: string, cancellationDate?: string, cancelSurveyResult?: ICancelSurveyResult) {
    this.id = uuidv1();
    this.deviceID = deviceID;
    this.productID = productID;
    this.appUserID = appUserID;
    this.platform = platform;
    this.store = store;
    this.creationDate = creationDate;
    this.sessionID = sessionID;
    this.appVersion = appVersion;
    this.productName = productName;
    this.transactionID = transactionID;
    this.localCurrency = localCurrency;
    this.localPrice = localPrice;
    this.purchaseDate = purchaseDate;
    this.expirationDate = expirationDate;
    this.notificationType = notificationType;
    this.purchaseToken = purchaseToken;
    this.packageName = packageName;
    this.isFreeTrial = isFreeTrial;
    this.autoRenewing = autoRenewing;
    this.initialPurchaseID = initialPurchaseID;
    this.cancelReason = cancelReason;
    this.cancellationDate = cancellationDate;
    this.cancelSurveyResult = cancelSurveyResult;
  }
}



