import { ApiModelProperty } from '@nestjs/swagger';

export class BigDataRequest {

  @ApiModelProperty({ required: true })
  deviceID: string;

}
