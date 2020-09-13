import { ApiModelProperty } from '@nestjs/swagger';

export class VideosProgress {
  @ApiModelProperty({required: true})
  pageID: string;

  @ApiModelProperty({required: true})
  frames: number;
}

export class FranchiseUserDataList {
  @ApiModelProperty({required: true})
  franchiseTemplateID: number;

  @ApiModelProperty({required: true})
  lastSeenVideoPageID: string;
}

export class SaveVideosRequest {

  @ApiModelProperty({required: true})
  appUserID: string;

  @ApiModelProperty({required: true})
  productID: string;

  @ApiModelProperty({required: true})
  versionID: number;

  @ApiModelProperty({required: true})
  videosProgress: VideosProgress [];

  @ApiModelProperty({required: true, type: [FranchiseUserDataList]})
  franchiseUserDataList: FranchiseUserDataList[];

  @ApiModelProperty({ required: false })
  sessionID: string;
}
