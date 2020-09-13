export interface ICancelSurveyResult {
  cancelSurveyReason: number;
}
export interface ISubscriptionPackage {
  kind?: string
  purchaseDate?: string;
  expireDate?: string;
  autoRenewing?: boolean;
  priceCurrencyCode?: string
  priceAmountMicros?: string;
  countryCode?: string;
  cancelReason?: number;
  paymentState?: number;
  cancellationDate?: string;
  renewDate?: string;
  orderId?: string;
  isFreeTrial?: boolean
  purchaseType?: number;
  userCancellationTimeMillis?: string;
  cancelSurveyResult?: ICancelSurveyResult;

  isInIntroOfferPeriod?: boolean;
  uniqueIdentifier?: string;
  quantity?: string;
  webOrderLineItemId?: string;
  uniqueVendorIdentifier?: string;
  itemId?: string;
  productId?: string;
  bid?: string;
  bvrs?: string;
}

