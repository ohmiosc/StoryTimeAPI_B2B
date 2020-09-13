import { ApiModelProperty } from '@nestjs/swagger';

export class StepProgress {
  @ApiModelProperty({ required: true })
  id: string;

  @ApiModelProperty({ required: true })
  stepStatus: string;

  constructor(id: string, stepStatus: string) {
    this.id = id;
    this.stepStatus = stepStatus;
  }
}
