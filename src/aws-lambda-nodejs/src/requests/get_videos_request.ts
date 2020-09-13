import { ApiModelProperty } from '@nestjs/swagger';

export class GetVideosRequest {

  @ApiModelProperty({required: true})
  appUserID: string;

  @ApiModelProperty({required: true})
  productID: string;

}
