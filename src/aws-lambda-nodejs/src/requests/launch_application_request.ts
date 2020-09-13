import { ApiModelProperty } from '@nestjs/swagger';

export class LaunchAppRequest {

  @ApiModelProperty({required: false})
  appUserID: string;

  @ApiModelProperty({required: true})
  productID: string;

  @ApiModelProperty({required: true})
  deviceID: string;

  @ApiModelProperty({required: false})
  platform: string;

  @ApiModelProperty({required: false})
  appVersion: string;

  @ApiModelProperty({required: false})
  launchSource: string;

  @ApiModelProperty({required: false})
  deviceAdvertisingId: string;

  @ApiModelProperty({required: false})
  appsFlyerRefferal: string;

  @ApiModelProperty({required: false})
  deviceManufacturer: string;

  @ApiModelProperty({required: false})
  deviceModel: string;

  @ApiModelProperty({required: false})
  deviceOS: string;
}
