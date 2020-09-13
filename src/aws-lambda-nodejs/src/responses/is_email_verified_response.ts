export interface IIsEmailVerifiedResponse {
  appUserID: string;
  productID: string;
  deviceID: string;
  userType: number;
  isValidated: number;
  failureReason: number;
}

export class IsEmailVerifiedResponse implements IIsEmailVerifiedResponse {
  appUserID: string;
  deviceID: string;
  failureReason: number;
  isValidated: number;
  productID: string;
  userType: number;

  constructor(appUserID: string, deviceID: string, failureReason: number, isValidated: number, productID: string, userType: number) {
    this.appUserID = appUserID;
    this.deviceID = deviceID;
    this.failureReason = failureReason;
    this.isValidated = isValidated;
    this.productID = productID;
    this.userType = userType;
  }
}
