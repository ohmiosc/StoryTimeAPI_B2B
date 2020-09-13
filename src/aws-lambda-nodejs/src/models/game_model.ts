import { ApiModelProperty } from '@nestjs/swagger';
import { StepProgress } from './common/steps_progress';
import { Exclude } from 'class-transformer';
const uuidv1 = require('uuid/v1');

export class Game {

  @Exclude()
  id: string;

  @Exclude()
  appUserId: string;

  @Exclude()
  gameId: string;

  @ApiModelProperty({ required: true, type: [StepProgress] })
  stepsProgress: StepProgress[];

  constructor(appUserId: string, gameId: string) {
    this.id = uuidv1();
    this.appUserId = appUserId;
    this.gameId = gameId;
  }

}
