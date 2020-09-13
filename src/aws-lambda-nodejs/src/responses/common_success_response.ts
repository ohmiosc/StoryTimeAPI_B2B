import { ApiModelProperty } from '@nestjs/swagger';

export class CommonSuccessResponse {

  @ApiModelProperty()
  statusCode: number;

  @ApiModelProperty()
  status: string;

  @ApiModelProperty()
  message: string;

  constructor(statusCode: number, status: string, message: string) {
    this.statusCode = statusCode;
    this.status = status;
    this.message = message;
  }
}
