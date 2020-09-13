import { ApiModelProperty } from '@nestjs/swagger';

export class AppUserProgressionLevels {
  @ApiModelProperty()
  templateID: number;
  @ApiModelProperty()
  level: number;
}
