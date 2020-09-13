import { ApiModelProperty } from '@nestjs/swagger';

export class AppUserProgressionQuestions {
  @ApiModelProperty({ required: true })
  ID: number;

  @ApiModelProperty({ required: true })
  correctAnswers: number;
}

export class SaveQuestionsRequest {
  @ApiModelProperty({ required: true })
  appUserID: string;

  @ApiModelProperty({ required: true })
  productID: string;

  @ApiModelProperty({ required: true })
  versionID: number;

  @ApiModelProperty({ required: true, type: [ AppUserProgressionQuestions] })
  questionsUserDataList: AppUserProgressionQuestions[];

  @ApiModelProperty({ required: false })
  sessionID: string;
}
