import { ApiModelProperty } from '@nestjs/swagger';

export class SendEmailResponse {

  @ApiModelProperty()
  productID: string;

  @ApiModelProperty()
  deviceID: string;

  @ApiModelProperty()
  appUserID: string;

  @ApiModelProperty()
  userType: number;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  isSucceeded: number;

  @ApiModelProperty()
  message: string;

  @ApiModelProperty()
  failureReason: number;

  constructor(productID: string, deviceID: string, appUserID: string, userType: number,
              email: string, isSucceeded: number, message: string, failureReason: number) {
    this.productID = productID;
    this.deviceID = deviceID;
    this.appUserID = appUserID;
    this.userType = userType;
    this.email = email;
    this.isSucceeded = isSucceeded;
    this.message = message;
    this.failureReason = failureReason;
  }
}
