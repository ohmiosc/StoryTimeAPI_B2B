export interface IProvider {
  isAreaCode: number;
  msisdnLength: number;
  onlineCancellation: number;
  operatorType: string;
  siteID: number;
  voucherSupport: number;
}

export interface ILookupBilling {
  detectedCountry: string;
  provider: IProvider[];
}
