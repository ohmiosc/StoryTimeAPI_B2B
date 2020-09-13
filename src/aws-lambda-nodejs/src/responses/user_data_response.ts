import { ApiModelProperty } from '@nestjs/swagger';

export class SetUserDataResponse {

  @ApiModelProperty()
  statusCode: number;

  @ApiModelProperty()
  status: string;

  @ApiModelProperty()
  message: string;
}
