import { ApiModelProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiModelProperty()
  statusCode: number;

  @ApiModelProperty()
  status: string;

  @ApiModelProperty()
  message: string;
}

export const errorResponse = (inputStatusCode: number, inputStatus: string, errorMessage: string): ErrorResponse => {
  const response: ErrorResponse = {
    statusCode: inputStatusCode,
    status: inputStatus,
    message: errorMessage,
  };
  return response;
};
