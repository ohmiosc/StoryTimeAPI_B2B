import { ApiModelProperty } from '@nestjs/swagger';

export class LoginRegularRequest {

  @ApiModelProperty({required: true})
  appUserID: string;

  @ApiModelProperty({required: true})
  productID: string;

  @ApiModelProperty({required: true})
  deviceID: string;

  @ApiModelProperty({required: true})
  registrationType: number;

  @ApiModelProperty({required: true})
  email: string;

  @ApiModelProperty({required: false})
  password: string;

  @ApiModelProperty({required: false})
  platform: string;

}
