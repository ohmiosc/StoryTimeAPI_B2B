import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateUserTypeRequest {
  @ApiModelProperty({required: true})
  appUserID: string;

  @ApiModelProperty({required: true})
  productID: string;

  @ApiModelProperty({required: true})
  deviceID: string;

  @ApiModelProperty({required: true})
  userType: number;

}
