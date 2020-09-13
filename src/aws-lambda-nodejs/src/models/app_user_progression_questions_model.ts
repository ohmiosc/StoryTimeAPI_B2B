import { ApiModelProperty } from '@nestjs/swagger';

export class AppUserProgressionQuestions {
  @ApiModelProperty()
  ID: number;

  @ApiModelProperty()
  correctAnswers: number;
}
