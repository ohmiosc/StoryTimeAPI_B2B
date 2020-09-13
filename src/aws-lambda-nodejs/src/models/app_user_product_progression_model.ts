import { AppUserProgressionLevels } from './app_user_progression_levels_model';
import { LastPlayedLevel } from '../responses/vocabs_user_response';
import { AppUserProgressionVideos } from './app_user_progression_videos_model';
import { AppUserProgressionQuestions } from './app_user_progression_questions_model';
import { ApiModelProperty } from '@nestjs/swagger';
import { VocabsUserData } from '../requests/save_vocabs_request';

export class AppUserProductProgression {

  @ApiModelProperty()
  sessionID: string;

  @ApiModelProperty({type: [AppUserProgressionVideos]})
  videoUserDataList: Array<AppUserProgressionVideos>;

  @ApiModelProperty({type: [AppUserProgressionLevels]})
  levelsUserDataList: Array<AppUserProgressionLevels>;

  @ApiModelProperty({type: [AppUserProgressionQuestions]})
  questionsUserDataList: Array<AppUserProgressionQuestions>;

  @ApiModelProperty()
  appUserID: string;

  @ApiModelProperty()
  creationDate: string;

  @ApiModelProperty()
  id: string;

  @ApiModelProperty({type: [LastPlayedLevel]})
  lastPlayedLevel: Array<LastPlayedLevel>;

  @ApiModelProperty()
  lastUpdateDate: string;

  @ApiModelProperty()
  productID: string;

  @ApiModelProperty({type: [VocabsUserData]})
  vocabsUserDataList: Array<VocabsUserData>;
}
