import { ISubscriptionData } from './subscription_data_model';

export interface IReceipt {
  Payload: string;
  TransactionID: string;
  Store: string;
}

export interface ISubscriptionPackage {
  receipt: IReceipt;
  subscriptionData?: ISubscriptionData;
  storeID: number;
  transactionID: string;
  productID: string;
  productType: number;
  isoCurrencyCode: string;
  localizedPrice: string;
  purchaseDate: string;
}

export class SubscriptionPackage implements ISubscriptionPackage {
  isoCurrencyCode: string;
  localizedPrice: string;
  productID: string;
  productType: number;
  purchaseDate: string;
  receipt: IReceipt;
  storeID: number;
  subscriptionData?: ISubscriptionData;
  transactionID: string;

  constructor(isoCurrencyCode: string, localizedPrice: string, productID: string, productType: number, purchaseDate: string,
              receipt: IReceipt, storeID: number,  transactionID: string, subscriptionData?: ISubscriptionData) {
    this.isoCurrencyCode = isoCurrencyCode;
    this.localizedPrice = localizedPrice;
    this.productID = productID;
    this.productType = productType;
    this.purchaseDate = purchaseDate;
    this.receipt = receipt;
    this.storeID = storeID;
    this.subscriptionData = subscriptionData;
    this.transactionID = transactionID;
  }
}
