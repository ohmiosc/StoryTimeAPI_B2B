import { ApiModelProperty } from '@nestjs/swagger';

export class LoginAlternativeRequest {

  @ApiModelProperty({required: true})
  appUserID: string;

  @ApiModelProperty({required: true})
  productID: string;

  @ApiModelProperty({required: true})
  deviceID: string;

  @ApiModelProperty({required: true})
  operatorName: string;

  @ApiModelProperty({required: true})
  MSISDN: string;

  @ApiModelProperty({required: true})
  siteID: number;

}
