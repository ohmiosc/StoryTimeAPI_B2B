const uuidv1 = require('uuid/v1');

export class TransactionModel {
  private appUserID: string;
  private appVersion: string;
  private currency: string;
  private deviceID: string;
  private expirationDate: string;
  private price: string;
  private productID: string;
  private productName: string;
  private purchaseDate: string;
  private store: number;
  private storeStatusDate: string;
  private storeTransactionID: string;
  private storeTransactionStatus: string;
  private transactionID: string;
  private updateDate: string;
  private initialPurchaseID: string;

  constructor(appUserID: string, appVersion: string, currency: string, deviceID: string, expirationDate: string, price: string, productID: string,
              productName: string, purchaseDate: string, store: number, storeStatusDate: string, storeTransactionID: string,
              storeTransactionStatus: string, updateDate: string, initialPurchaseID) {
    this.transactionID = uuidv1();
    this.appUserID = appUserID;
    this.appVersion = appVersion;
    this.currency = currency;
    this.deviceID = deviceID;
    this.expirationDate = expirationDate;
    this.price = price;
    this.productID = productID;
    this.productName = productName;
    this.purchaseDate = purchaseDate;
    this.store = store;
    this.storeStatusDate = storeStatusDate;
    this.storeTransactionID = storeTransactionID;
    this.storeTransactionStatus = storeTransactionStatus;
    this.updateDate = updateDate;
    this.initialPurchaseID = initialPurchaseID;
  }
}
