import { ApiModelProperty } from '@nestjs/swagger';
import { randomUUIDV4 } from '../lib/generator';
import { AppUserProgressionQuestions } from './app_user_progression_questions_model';

export class AppUserProgressionQuestionsByProduct  {

  @ApiModelProperty()
  appUserID: string;

  @ApiModelProperty()
  creationDate: string;

  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  lastUpdateDate: string;

  @ApiModelProperty()
  productID: string;

  @ApiModelProperty()
  sessionID: string;

  @ApiModelProperty({type: [AppUserProgressionQuestions]})
  questionsUserDataList: Array<AppUserProgressionQuestions>;

  @ApiModelProperty()
  versionID: number;

  constructor( appUserID: string, creationDate: string, lastUpdateDate: string, productID: string, questionsUserDataList: Array<AppUserProgressionQuestions>, versionID: number){
    this.appUserID = appUserID;
    this.creationDate = creationDate;
    this.lastUpdateDate = lastUpdateDate;
    this.productID = productID;
    this.questionsUserDataList = questionsUserDataList;
    this.versionID = versionID;
    this.id = randomUUIDV4();
  }
}
