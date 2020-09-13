export interface IInstallation {
  id: string;
  productID: string;
  installationDate: string;

  marketingReferral?: string;
  deviceManufacturer?: string;
  deviceModel?: string;
  language?: string;
  country?: string;
  deviceAdvertisingID?: string;
  appVersion?: string;
  installationHistory?: IInstallation[];
}

export class Installation implements IInstallation {

  appVersion: string;
  country: string;
  deviceAdvertisingID: string;
  deviceManufacturer: string;
  deviceModel: string;
  id: string;
  installationDate: string;
  installationHistory: IInstallation[];
  language: string;
  marketingReferral: string;
  productID: string;

  constructor(appVersion: string, country: string, deviceAdvertisingID: string, deviceManufacturer: string,
              deviceModel: string, id: string, installationDate: string, installationHistory: IInstallation[],
              language: string, marketingReferral: string, productID: string) {
    this.appVersion = appVersion;
    this.country = country;
    this.deviceAdvertisingID = deviceAdvertisingID;
    this.deviceManufacturer = deviceManufacturer;
    this.deviceModel = deviceModel;
    this.id = id;
    this.installationDate = installationDate;
    this.installationHistory = installationHistory;
    this.language = language;
    this.marketingReferral = marketingReferral;
    this.productID = productID;
  }
}
