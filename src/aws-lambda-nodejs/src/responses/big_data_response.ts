import { ApiModelProperty } from '@nestjs/swagger';

export class BigDataResponse {

  @ApiModelProperty()
  isInfoUploaded: boolean;

  @ApiModelProperty()
  message: string;

  constructor(isInfoUploaded: boolean, message: string) {
    this.isInfoUploaded = isInfoUploaded;
    this.message = message;
  }

}
