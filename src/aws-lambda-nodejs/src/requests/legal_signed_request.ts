import { ApiModelProperty } from '@nestjs/swagger';

export class LegalSignedRequest {
  @ApiModelProperty({required: true})
  appUserID: string;

  @ApiModelProperty({required: true})
  productID: string;

  @ApiModelProperty({required: true})
  deviceID: string;

}
