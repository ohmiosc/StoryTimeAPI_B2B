import { ApiModelProperty } from '@nestjs/swagger';

export class ContactUsWebRequest {

  @ApiModelProperty({required: true})
  name: string;

  @ApiModelProperty({required: true})
  email: string;

  @ApiModelProperty({required: true})
  message: string;

  @ApiModelProperty({required: true})
  token: string;

  @ApiModelProperty({required: true})
  lang: string;

}
