import { ApiModelProperty } from '@nestjs/swagger';

export class SaveOptinRequest {
  @ApiModelProperty({required: true})
  appUserID: string;

  @ApiModelProperty({required: true})
  productID: string;

  @ApiModelProperty({required: true})
  deviceID: string;

}
