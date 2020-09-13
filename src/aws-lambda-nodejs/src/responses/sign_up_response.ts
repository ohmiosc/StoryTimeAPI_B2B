import { Signed } from './launch_app_response';
import { ApiModelProperty } from '@nestjs/swagger';

export class SignUpResponse {

  @ApiModelProperty()
  ageOptIn: Signed;

  @ApiModelProperty()
  appUserID: string;

  @ApiModelProperty()
  deviceID: string;

  @ApiModelProperty()
  failureReason: number;

  @ApiModelProperty()
  isSucceeded: number;

  @ApiModelProperty()
  legal: Signed;

  @ApiModelProperty()
  productID: string;

  @ApiModelProperty()
  signUpProcess: Signed;

  @ApiModelProperty()
  userType: number;

  constructor(ageOptIn: Signed, appUserID: string, deviceID: string, failureReason: number, isSucceeded: number,
              legal: Signed, productID: string, signUpProcess: Signed, userType: number) {
    this.ageOptIn = ageOptIn;
    this.appUserID = appUserID;
    this.deviceID = deviceID;
    this.failureReason = failureReason;
    this.isSucceeded = isSucceeded;
    this.legal = legal;
    this.productID = productID;
    this.signUpProcess = signUpProcess;
    this.userType = userType;
  }
}
