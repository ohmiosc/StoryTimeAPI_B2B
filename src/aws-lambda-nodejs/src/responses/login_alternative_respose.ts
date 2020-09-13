import { Legal } from '../models/legal_model';
import { AgeOptIn } from '../models/age_optin_model';
import { ApiModelProperty } from '@nestjs/swagger';

export class LoginAlternativeResponse {
  @ApiModelProperty()
  appUserID: string;

  @ApiModelProperty()
  productID: string;

  @ApiModelProperty()
  deviceID: string;

  @ApiModelProperty()
  userType: number;

  @ApiModelProperty({type: [Legal]})
  legal: Legal;

  @ApiModelProperty({type: [AgeOptIn]})
  ageOptIn: AgeOptIn;

  @ApiModelProperty({type: [Legal]})
  signUpProcess: Legal;

  @ApiModelProperty()
  failureReason: number;

  @ApiModelProperty()
  isSucceeded: number;

  constructor(appUserID: string, productID: string, deviceID: string, userType: number, legal: number, legalDate: string, ageOptIn: number, ageOptinDate: string,
              signUpProcess: number, signUpProcessDate: string, failureReason: number, isSucceeded: number) {
    this.appUserID = appUserID;
    this.productID = productID;
    this.deviceID = deviceID;
    this.userType = userType;
    this.legal = new Legal(legal, legalDate);
    this.ageOptIn = new AgeOptIn(ageOptIn, ageOptinDate);
    this.signUpProcess = new Legal(signUpProcess, signUpProcessDate);
    this.failureReason = failureReason;
    this.isSucceeded = isSucceeded;
  }
}
