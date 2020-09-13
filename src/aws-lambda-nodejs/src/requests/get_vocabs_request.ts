import { ApiModelProperty } from '@nestjs/swagger';

export class GetVocabsRequest {

  @ApiModelProperty({required: true})
  appUserID: string;

  @ApiModelProperty({required: true})
  productID: string;

}
