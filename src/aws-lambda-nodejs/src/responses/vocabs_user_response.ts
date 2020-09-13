import { ApiModelProperty } from '@nestjs/swagger';
import { VocabsUserData } from '../requests/save_vocabs_request';

export class VocabsUserResponse {
  @ApiModelProperty()
  message: string;
}

export class Rate {

  @ApiModelProperty()
  expose: number;

  @ApiModelProperty()
  failure: number;

  @ApiModelProperty()
  knowledge: number;

  @ApiModelProperty()
  voiceFailure: number;

  @ApiModelProperty()
  voiceSuccess: number;
}

export class LastPlayedLevel {

  @ApiModelProperty()
  level: number;

  @ApiModelProperty()
  templateID: number;
}

export class IVocabsUserData {

  @ApiModelProperty()
  ID: number;

  @ApiModelProperty({type: [Rate]})
  rates: Array<Rate>;
}

export class GetVocabsUserResponse {

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
