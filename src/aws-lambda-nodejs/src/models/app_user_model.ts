import { IProvider } from './lookup_billing_model';

export interface ILocation {
  ipAddress: string;
  country: string;
  city: string;
  region: string;
}

export interface IProduct {
  productId: string;
  deviceId: string;
  subscriptionStart?: string;
  subscriptionState?: number;
  trielVersion?: number;
  trielVersionDate?: string;
  validUntil?: string;
}

export interface IAppUser {
  id: string;
  deviceID: string;
  productID: string;
  sessionID: string;
  userType: number;
  mySqlID: number;

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
  location?: ILocation[];
  products?: IProduct[];
  operatorsList?: IProvider[];
  msisdn?: string;
  isAdult?: number;
  registeredOperatorName?: string;
}

export class AppUser implements IAppUser {
  constructor(
    public ageOptin: number,
    public ageOptinDate: string,
    public appVersion: string,
    public appsFlyerID: string,
    public creationDate: string,
    public deviceID: string,
    public email: string,
    public emailValidationDate: string,
    public id: string,
    public isLegalSigned: number,
    public isValidated: number,
    public lastLanguage: string,
    public lastSubscription: string,
    public legalDate: string,
    public password: string,
    public platform: string,
    public productID: string,
    public productName: string,
    public registrationType: number,
    public sessionID: string,
    public signUpProcess: number,
    public signUpProcessDate: string,
    public subscriptionExpirationDate: string,
    public userType: number,
    public location: ILocation[],
    public products: IProduct[],
    public operatorsList: IProvider[],
    public msisdn: string,
    public mySqlID: number,
    public isAdult: number
  ) {}
}

export class GuestAppUser implements IAppUser {
  constructor(
    public id: string,
    public deviceID: string,
    public productID: string,
    public sessionID: string,
    public creationDate: string,
    public userType: number,
    public operatorsList: IProvider[],
    public location: ILocation[],
    public products: IProduct[],
    public platform: string,
    public appVersion: string,
    public productName: string,
    public mySqlID: number,
  ) {}
}

export class Product implements IProduct {
  constructor(
    public productId: string,
    public deviceId: string,
    public subscriptionStart: string,
    public subscriptionState: number,
    public trielVersion: number,
    public trielVersionDate: string,
    public validUntil: string,
  ) {}
}
