import { ApiModelProperty } from '@nestjs/swagger';

export class ContactUsRequest {

  @ApiModelProperty({required: true})
  appUserID: string;

  @ApiModelProperty({required: true})
  productID: string;

  @ApiModelProperty({required: true})
  deviceID: string;

  @ApiModelProperty({required: true})
  appVersion: string;

  @ApiModelProperty({required: true})
  msgaddress: string;

  @ApiModelProperty({required: true})
  userName: string;

  @ApiModelProperty({required: true})
  msgText: string;

}
