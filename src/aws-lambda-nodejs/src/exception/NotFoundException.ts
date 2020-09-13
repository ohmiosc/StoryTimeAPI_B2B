import { HttpException } from '@nestjs/common';

export class NotFoundException extends HttpException{
  constructor(response: string | object, status: number) {
    super(response, status);
  }
}
