import { ISubscriptionPackage } from './subscription_package_model';

export interface ISubscriptionHistory {
  id: string;
  deviceID: string;
  productID: string;

  platform?: string;
  store?: number;
  creationDate?: string;
  sessionID?: string;
  appVersion?: string;
  productName?: string;
  sale?: string;
  transactionID?: string;
  priceUSD?: string;
  localCurrency?: string;
  localPrice?: string;
  purchaseDate?: string;
  expirationDate?: string;
  subscriptions?: ISubscriptionPackage[];
}

export class SubscriptionHistory implements ISubscriptionHistory {
  appVersion: string;
  creationDate: string;
  deviceID: string;
  expirationDate: string;
  id: string;
  localCurrency: string;
  localPrice: string;
  platform: string;
  priceUSD: string;
  productID: string;
  productName: string;
  purchaseDate: string;
  sale: string;
  sessionID: string;
  store: number;
  subscriptions: ISubscriptionPackage[];
  transactionID: string;

  constructor() {
  }
}
