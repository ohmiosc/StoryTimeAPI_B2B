import { ApiModelProperty } from '@nestjs/swagger';

export class SaveOptinResponse {
  @ApiModelProperty()
  appUserID: string;

  @ApiModelProperty()
  deviceID: string;

  @ApiModelProperty()
  isSucceeded: number;

  @ApiModelProperty()
  productID: string;

  @ApiModelProperty()
  userType: number;

  @ApiModelProperty()
  message: string;

  @ApiModelProperty()
  statusCode: number;

  @ApiModelProperty()
  status: string;

  constructor(message: string, statusCode: number, status: string, appUserID: string, deviceID: string, isSucceeded: number, productID: string, userType: number) {
    this.appUserID = appUserID;
    this.deviceID = deviceID;
    this.isSucceeded = isSucceeded;
    this.productID = productID;
    this.userType = userType;
  }
}
