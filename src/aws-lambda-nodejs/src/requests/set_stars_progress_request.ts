import { ApiModelProperty } from '@nestjs/swagger';

export class SetStarsProgressRequest {

@ApiModelProperty({required: false})
  userProgress: number;

@ApiModelProperty({required: false})
  pinkStars: number;

  @ApiModelProperty({required: false})
  greenStars: number;

  @ApiModelProperty({required: false})
  colorStars: number;

}
