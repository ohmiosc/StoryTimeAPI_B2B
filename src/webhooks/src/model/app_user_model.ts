export interface ILocation {
  ipAddress: string;
  country: string;
  city: string;
  region: string;
}

export interface IProduct {
  productId: string;
  deviceId: string;
}
export interface IAppUser {
  id: string;
  deviceID: string;
  productID: string;
  sessionID: string;
  userType: number;

  email?: string;
  password?: string;
  creationDate: string;
  isValidated?: number;
  emailValidationDate?: string;
  isLegalSigned?: number;
  signUpProcess?: number;
  ageOptin?: number;
  legalDate?: string;
  signUpProcessDate?: string;
  ageOptinDate?: string;
  registrationType?: number;
  lastSubscription?: string;
  appsFlyerID?: string;
  lastLanguage?: string;
  platform?: string;
  subscriptionExpirationDate?: string;
  productName?: string;
  appVersion?: string;
  locations?: ILocation[];
  products?: IProduct[];
}

export class AppUser implements IAppUser {

  ageOptin: number;
  ageOptinDate: string;
  appVersion: string;
  appsFlyerID: string;
  creationDate: string;
  deviceID: string;
  email: string;
  emailValidationDate: string;
  id: string;
  isLegalSigned: number;
  isValidated: number;
  lastLanguage: string;
  lastSubscription: string;
  legalDate: string;
  password: string;
  platform: string;
  productID: string;
  productName: string;
  registrationType: number;
  sessionID: string;
  signUpProcess: number;
  signUpProcessDate: string;
  subscriptionExpirationDate: string;
  userType: number;
  locations: ILocation[];
  products: IProduct[];

  constructor(ageOptin: number, ageOptinDate: string, appVersion: string, appsFlyerID: string, creationDate: string,
              deviceID: string, email: string, emailValidationDate: string, id: string, isLegalSigned: number,
              isValidated: number, lastLanguage: string, lastSubscription: string, legalDate: string, password: string,
              platform: string, productID: string, productName: string, registrationType: number, sessionID: string,
              signUpProcess: number, signUpProcessDate: string, subscriptionExpirationDate: string, userType: number,
              locations: ILocation[], products: IProduct[]) {
    this.ageOptin = ageOptin;
    this.ageOptinDate = ageOptinDate;
    this.appVersion = appVersion;
    this.appsFlyerID = appsFlyerID;
    this.creationDate = creationDate;
    this.deviceID = deviceID;
    this.email = email;
    this.emailValidationDate = emailValidationDate;
    this.id = id;
    this.isLegalSigned = isLegalSigned;
    this.isValidated = isValidated;
    this.lastLanguage = lastLanguage;
    this.lastSubscription = lastSubscription;
    this.legalDate = legalDate;
    this.password = password;
    this.platform = platform;
    this.productID = productID;
    this.productName = productName;
    this.registrationType = registrationType;
    this.sessionID = sessionID;
    this.signUpProcess = signUpProcess;
    this.signUpProcessDate = signUpProcessDate;
    this.subscriptionExpirationDate = subscriptionExpirationDate;
    this.userType = userType;
    this.locations = locations;
    this.products = products;
  }
}
