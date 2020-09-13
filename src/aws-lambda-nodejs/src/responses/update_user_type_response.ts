import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateUserTypeResponse {

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

  constructor(appUserID: string, deviceID: string, isSucceeded: number, productID: string, userType: number) {
    this.appUserID = appUserID;
    this.deviceID = deviceID;
    this.isSucceeded = isSucceeded;
    this.productID = productID;
    this.userType = userType;
  }
}
