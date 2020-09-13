import { ApiModelProperty } from '@nestjs/swagger';

export class VideosProgress {
  @ApiModelProperty()
  pageID: string;
  @ApiModelProperty()
  frames: number;
}

export class FranchiseUserDataList {
  @ApiModelProperty()
  franchiseTemplateID: number;
  @ApiModelProperty()
  lastSeenVideoPageID: string;
}

export class AppUserProgressionVideosByProduct {

  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  appUserID: string;

  @ApiModelProperty()
  productID: string;

  @ApiModelProperty()
  versionID: number;

  @ApiModelProperty()
  creationDate: string;

  @ApiModelProperty()
  lastUpdateDate: string;

  @ApiModelProperty({ type: [VideosProgress] })
  videosProgress: Array<VideosProgress>;

  @ApiModelProperty({ type: [FranchiseUserDataList] })
  franchiseUserDataList: Array<FranchiseUserDataList>;
}
