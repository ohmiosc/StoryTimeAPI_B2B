export interface ISession {
  id: string;
  userID: string;
  productID: string;
  userType: number;
  platform?: string;
  language?: string;
  productName?: string;
  startTime: string;
  endTime?: string;
  launchSource?: string;
  deviceAdvertisingID?: string;
  appVersion?: string;
  appsFlyerRefferal?: string;
  subscriptionType?: string;
}

export class Session implements ISession {
  startTime: string;
  constructor(
    public id: string,
    public userID: string,
    public productID: string,
    public userType: number,
    public platform: string,
    public language: string,
    public productName: string = null,
    public appVersion: string,
    public appsFlyerRefferal: string = null,
    public deviceAdvertisingID: string = null,
    public endTime: string = null,
    public launchSource: string = null,
    public subscriptionType: string = null,
  ) {
    this.startTime = new Date().toISOString();
  }
}
