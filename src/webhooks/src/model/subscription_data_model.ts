export interface ISubscriptionData {
  isFreeTrial: number;
  isIntroductoryPricePeriod: number;
  introductoryPricePeriodCycles: number;
  introductoryPricePeriod: string;
  remainingTime: string;
  introductoryPrice: string;
  expireDate: string;
}

export class SubscriptionData implements ISubscriptionData {
  expireDate: string;
  introductoryPrice: string;
  introductoryPricePeriod: string;
  introductoryPricePeriodCycles: number;
  isFreeTrial: number;
  isIntroductoryPricePeriod: number;
  remainingTime: string;

  constructor(expireDate: string, introductoryPrice: string, introductoryPricePeriod: string, introductoryPricePeriodCycles: number,
              isFreeTrial: number, isIntroductoryPricePeriod: number, remainingTime: string) {
    this.expireDate = expireDate;
    this.introductoryPrice = introductoryPrice;
    this.introductoryPricePeriod = introductoryPricePeriod;
    this.introductoryPricePeriodCycles = introductoryPricePeriodCycles;
    this.isFreeTrial = isFreeTrial;
    this.isIntroductoryPricePeriod = isIntroductoryPricePeriod;
    this.remainingTime = remainingTime;
  }
}
