import { ApiModelProperty } from '@nestjs/swagger';

export class LookupCountry {
  @ApiModelProperty()
  detectedCountry: string;

  @ApiModelProperty()
  productLanguage: string;

  @ApiModelProperty()
  productName: string;
}
