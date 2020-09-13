import { ApiModelProperty } from '@nestjs/swagger';

export class ValidatePasswordRequest {

  @ApiModelProperty({required: true})
  email: string;

  @ApiModelProperty({required: true})
  token: string;

  @ApiModelProperty({required: true})
  password: string;

}
