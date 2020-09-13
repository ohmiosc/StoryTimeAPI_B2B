import { ApiModelProperty } from '@nestjs/swagger';

export class GetSpinnerProgressRequest {

  @ApiModelProperty({required: true})
  appUserID: string;

  @ApiModelProperty({required: true})
  productID: string;

  @ApiModelProperty({required: true})
  franchiseID: number;

}
