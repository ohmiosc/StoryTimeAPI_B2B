import { ApiModelProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
const uuidv1 = require('uuid/v1');

export class ContentVersion {

  @Exclude()
  id: string;

  @ApiModelProperty({ required: true })
  version_id: string;

  @ApiModelProperty({ required: true })
  creation_date_ms: number;

  @ApiModelProperty({ required: false })
  creation_date: string;

  constructor(version_id: string, creation_date_ms: number, creation_date: string) {
    this.id = uuidv1();
    this.version_id = version_id;
    this.creation_date_ms = creation_date_ms;
    this.creation_date = creation_date;
  }
}
