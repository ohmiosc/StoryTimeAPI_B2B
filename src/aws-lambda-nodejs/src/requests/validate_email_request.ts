import { ApiModelProperty } from '@nestjs/swagger';

export class ValidateEmailRequest {

  @ApiModelProperty({required: true})
  email: string;

  @ApiModelProperty({required: true})
  token: string;

}
