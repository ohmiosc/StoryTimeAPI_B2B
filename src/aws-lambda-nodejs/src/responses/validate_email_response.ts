import { ApiModelProperty } from '@nestjs/swagger';

export class ValidateEmailResponse implements ValidateEmailResponse {

  @ApiModelProperty()
  statusCode: number;

  @ApiModelProperty()
  message?: string;

  constructor(statusCode: number, message?: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class ValidatePasswordResponse  {

  @ApiModelProperty()
  message: string;

  @ApiModelProperty()
  statusCode: number;

  constructor(statusCode: number, message?: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}
