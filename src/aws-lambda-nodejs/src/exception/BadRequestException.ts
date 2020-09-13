import { HttpException } from '@nestjs/common';

export class BadRequestException extends HttpException{

  constructor(response: string | object, status: number) {
    super(response, status);
  }

}
