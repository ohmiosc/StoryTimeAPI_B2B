
import { ApiModelProperty } from '@nestjs/swagger';

export class ResetPasswordRequest {

  @ApiModelProperty({required: true})
  email: string;

}
