import { ApiModelProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Sticker } from './common/sticker';
const uuidv1 = require('uuid/v1');

export class Collection {

  @Exclude()
  id: string;

  @Exclude()
  appUserId: string;

  @Exclude()
  collectionId: string;

  @ApiModelProperty({ required: true, type: [Sticker] })
  stickers: Sticker[];

  constructor(appUserId: string, collectionId: string) {
    this.id = uuidv1();
    this.appUserId = appUserId;
    this.collectionId = collectionId;
  }
}
