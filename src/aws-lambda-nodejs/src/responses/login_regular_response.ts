import { ApiModelProperty } from '@nestjs/swagger';

export class LoginRegularResponse {
  @ApiModelProperty()
  appUserID: string;

  @ApiModelProperty()
  deviceID: string;

  @ApiModelProperty()
  failureReason: number;

  @ApiModelProperty()
  isSucceeded: number;

  @ApiModelProperty()
  productID: string;

  @ApiModelProperty()
  userType: number;

  constructor(appUserID: string, deviceID: string, failureReason: number, isSucceeded: number, productID: string, userType: number) {
    this.appUserID = appUserID;
    this.deviceID = deviceID;
    this.failureReason = failureReason;
    this.isSucceeded = isSucceeded;
    this.productID = productID;
    this.userType = userType;
  }
}
