import { ApiModelProperty } from '@nestjs/swagger';

export class GetQuestionsRequest {

  @ApiModelProperty({required: true})
  appUserID: string;

  @ApiModelProperty({required: true})
  productID: string;

}
