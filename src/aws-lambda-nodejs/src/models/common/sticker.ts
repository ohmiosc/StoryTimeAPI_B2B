import { ApiModelProperty } from '@nestjs/swagger';

export class Sticker {

  @ApiModelProperty({ required: true })
  id: string;

  @ApiModelProperty({ required: true })
  stickersCount: number;

  constructor(id: string, stickersCount: number) {
    this.id = id;
    this.stickersCount = stickersCount;
  }
}
