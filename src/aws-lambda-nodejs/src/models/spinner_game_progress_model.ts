import { ApiModelProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
const uuidv1 = require('uuid/v1');

export class DictionaryData {
  public keys: string[];
  public values: number[];
}

export class SpinnerGameProgress {

  @Exclude()
  id: string;

  @ApiModelProperty({ required: true })
  level: number;

  @ApiModelProperty({ required: true })
  bestScore: number;

  @ApiModelProperty({ required: true })
  bonusIndex: number;

  @ApiModelProperty({ required: true })
  offsetVocablary: number;

  @ApiModelProperty({ required: true, type: DictionaryData })
  CommonVocabs: DictionaryData;

  @ApiModelProperty({ required: true, type: DictionaryData })
  BonusVocabs: DictionaryData;

  @ApiModelProperty({ required: true })
  appUserID: string;

  @ApiModelProperty({ required: true })
  productID: string;

  @ApiModelProperty({ required: true })
  versionID: number;

  @ApiModelProperty({ required: true })
  franchiseID: number;

  constructor(franchiseID: number, level: number, bestScore: number, bonusIndex: number, offsetVocablary: number, CommonVocabs: DictionaryData, BonusVocabs: DictionaryData, appUserID: string, productID: string, versionID: number) {
    this.id = uuidv1();
    this.franchiseID = franchiseID;
    this.level = level;
    this.bestScore = bestScore;
    this.bonusIndex = bonusIndex;
    this.offsetVocablary = offsetVocablary;
    this.CommonVocabs = CommonVocabs;
    this.BonusVocabs = BonusVocabs;
    this.appUserID = appUserID;
    this.productID = productID;
    this.versionID = versionID;
  }
}
