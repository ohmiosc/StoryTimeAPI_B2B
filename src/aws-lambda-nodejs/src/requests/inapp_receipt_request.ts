import { ApiModelProperty } from '@nestjs/swagger';

export class DeveloperPayload {
  @ApiModelProperty({ required: true })
  developerPayload: string;

  @ApiModelProperty({ required: true })
  is_free_trial: boolean;

  @ApiModelProperty({ required: true })
  has_introductory_price_trial: boolean;

  @ApiModelProperty({ required: true })
  is_updated: false;

}

export class SkuDetails {
  @ApiModelProperty({ required: true })
  productId: string;

  @ApiModelProperty({ required: true })
  type: string;

  @ApiModelProperty({ required: true })
  price: string;

  @ApiModelProperty({ required: true })
  price_amount_micros: number;

  @ApiModelProperty({ required: true })
  price_currency_code: string;

  @ApiModelProperty({ required: true })
  subscriptionPeriod: string;

  @ApiModelProperty({ required: true })
  freeTrialPeriod: string;

  @ApiModelProperty({ required: true })
  title: string;

  @ApiModelProperty({ required: true })
  description: string;

}

export class Json {

  @ApiModelProperty({ required: true })
  orderId: string;

  @ApiModelProperty({ required: true })
  packageName: string;

  @ApiModelProperty({ required: true })
  productId: string;

  @ApiModelProperty({ required: true })
  purchaseTime: number;

  @ApiModelProperty({ required: true })
  purchaseState: number;

  @ApiModelProperty({ required: true })
  developerPayload: DeveloperPayload;

  @ApiModelProperty({ required: true })
  purchaseToken: string;

  @ApiModelProperty({ required: true })
  autoRenewing: boolean;
}

export class Payload {
  @ApiModelProperty({ required: true })
  json: Json;
  @ApiModelProperty({ required: true })
  signature: string;
  @ApiModelProperty({ required: true })
  skuDetails: SkuDetails;
  @ApiModelProperty({ required: true })
  isPurchaseHistorySupported: boolean;
}

export class AndroidReceipt {
  @ApiModelProperty({ required: true })
  Payload: Payload;
  @ApiModelProperty({ required: true })
  TransactionID: string;
  @ApiModelProperty({ required: true })
  Store: string;
}

export class AppleReceipt {
  @ApiModelProperty({ required: true })
  Payload: string;

  @ApiModelProperty({ required: true })
  TransactionID: string;

  @ApiModelProperty({ required: true })
  Store: string;
}

export class SubscriptionData {
  @ApiModelProperty({ required: false })
  expireDate: string;

  @ApiModelProperty({ required: false })
  introductoryPrice: string;

  @ApiModelProperty({ required: false })
  introductoryPricePeriod: string;

  @ApiModelProperty({ required: false })
  introductoryPricePeriodCycles: number;
  isFreeTrial: number;

  @ApiModelProperty({ required: false })
  isIntroductoryPricePeriod: number;

  @ApiModelProperty({ required: false })
  remainingTime: string;
}

export class SubscriptionPackage {

  @ApiModelProperty({ required: true })
  receipt: (AndroidReceipt | AppleReceipt);

  @ApiModelProperty({ required: true })
  subscriptionData: SubscriptionData;

  @ApiModelProperty({ required: true })
  storeID: number;

  @ApiModelProperty({ required: true })
  transactionID: string;

  @ApiModelProperty({ required: true })
  productID: string;

  @ApiModelProperty({ required: true })
  productType: number;

  @ApiModelProperty({ required: true })
  isoCurrencyCode: string;

  @ApiModelProperty({ required: true })
  localizedPrice: string;

  @ApiModelProperty({ required: true })
  purchaseDate: string;
}

export class InAppReceiptRequest {

  @ApiModelProperty({ required: true })
  appUserID: string;

  @ApiModelProperty({ required: true })
  productID: string;

  @ApiModelProperty({ required: true })
  deviceID: string;

  @ApiModelProperty({ required: false })
  private platform: string;

  @ApiModelProperty({ required: false })
  private sessionID: string;

  @ApiModelProperty({ required: false })
  private appVersion: string;

  @ApiModelProperty({ required: false })
  private appsFlyerID: string;

  @ApiModelProperty({ required: true })
  private package: SubscriptionPackage;
}
