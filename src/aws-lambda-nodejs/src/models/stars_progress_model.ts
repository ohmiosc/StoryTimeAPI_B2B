import { ApiModelProperty } from '@nestjs/swagger';
const uuidv1 = require('uuid/v1');

export class StarsProgress {

  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  appUserID: string;

  @ApiModelProperty()
  userProgress: number;

  @ApiModelProperty()
  pinkStars: number;

  @ApiModelProperty()
  greenStars: number;

  @ApiModelProperty()
  colorStars: number;

  constructor() {
    this.id = uuidv1();
  }
}
