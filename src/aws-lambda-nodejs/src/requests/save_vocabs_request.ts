import { ApiModelProperty } from '@nestjs/swagger';

export class Rate {
  @ApiModelProperty({required: true})
  expose: number;

  @ApiModelProperty({required: true})
  failure: number;

  @ApiModelProperty({required: true})
  knowledge: number;

  @ApiModelProperty({required: true})
  voiceFailure: number;

  @ApiModelProperty({required: true})
  voiceSuccess: number;
}

export class VocabsUserData {
  @ApiModelProperty({required: true})
  ID: string;

  @ApiModelProperty({required: true, type: [Rate]})
  rates: Rate[];
}

export class LastPlayedLevel {
  @ApiModelProperty({required: true})
  level: number;

  @ApiModelProperty({required: true})
  templateID: number;

  @ApiModelProperty({required: true})
  gameID: string;
}

export class SaveVocabsRequest {

  @ApiModelProperty({required: true})
  appUserID: string;

  @ApiModelProperty({required: true})
  productID: string;

  @ApiModelProperty({required: true})
  versionID: number;

  @ApiModelProperty({required: true, type: [LastPlayedLevel]})
  lastPlayedLevel: LastPlayedLevel[];

  @ApiModelProperty({required: true, type: [VocabsUserData]})
  vocabsUserDataList: VocabsUserData[];

  @ApiModelProperty({required: true})
  lastSeenCategory: number;

  @ApiModelProperty({ required: false })
  sessionID: string;
}
