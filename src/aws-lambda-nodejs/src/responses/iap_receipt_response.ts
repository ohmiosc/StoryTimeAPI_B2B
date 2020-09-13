import { ApiModelProperty } from '@nestjs/swagger';

export class IAPReceiptResponse {

  @ApiModelProperty()
  appUserID: string;

  @ApiModelProperty()
  deviceID: string;

  @ApiModelProperty()
  failureReason: number | string;

  @ApiModelProperty()
  isSucceeded: number;

  @ApiModelProperty()
  productID: string;

  @ApiModelProperty()
  userType: number;

  constructor() {
  }
}
