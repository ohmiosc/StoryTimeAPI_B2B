import { ApiModelProperty } from '@nestjs/swagger';

export class AppUserProgressionVideos {
  @ApiModelProperty()
  frames: number;

  @ApiModelProperty()
  pageID: string;
}
