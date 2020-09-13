import { ApiModelProperty } from '@nestjs/swagger';
import { StepProgress } from './common/steps_progress';
import { Exclude } from 'class-transformer';
const uuidv1 = require('uuid/v1');

export class Video {

  @Exclude()
  id: string;

  @Exclude()
  appUserId: string;

  @Exclude()
  videoId: string;

  @ApiModelProperty({ required: true })
  movieProgress: number;

  @ApiModelProperty({ required: true })
  movieStarCount: number;

  @ApiModelProperty({ required: true })
  movieUTCTime: number;

  @ApiModelProperty({ required: true, type: [StepProgress] })
  stepsProgress: StepProgress[];

  constructor(appUserId: string, videoId: string, movieProgress: number, movieStarCount: number, movieUTCTime: number) {
    this.id = uuidv1();
    this.appUserId = appUserId;
    this.videoId = videoId;
    this.movieProgress = movieProgress;
    this.movieStarCount = movieStarCount;
    this.movieUTCTime = movieUTCTime;
  }

}
