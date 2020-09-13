import { ApiModelProperty } from '@nestjs/swagger';
export class Provider {
  @ApiModelProperty()
  isAreaCode: number;

  @ApiModelProperty()
  msisdnLength: number;

  @ApiModelProperty()
  onlineCancellation: number;

  @ApiModelProperty()
  operatorType: string;

  @ApiModelProperty()
  siteID: number;

  @ApiModelProperty()
  voucherSupport: number;
}

export class LookupBilling {

  @ApiModelProperty()
  detectedCountry: string;

  @ApiModelProperty({ type: [Provider] })
  provider: Provider[];
}

export class Signed {
    @ApiModelProperty()
  isSigned: number;

  @ApiModelProperty()
  date: string;
}

export class LaunchAppResponse {
  @ApiModelProperty()
  appUserID: string;

  @ApiModelProperty()
  deviceID: string;

  @ApiModelProperty()
  productID: string;

  @ApiModelProperty()
  sessionID: string;

  @ApiModelProperty()
  userType: number;

  @ApiModelProperty({ type: [Signed] })
  ageOptIn: Signed;

  @ApiModelProperty({ type: [Signed] })
  signUpProcess: Signed;

  @ApiModelProperty({ type: [Signed] })
  legal: Signed;

  @ApiModelProperty({ type: [Provider] })
  operatorsList?: Provider[];

  @ApiModelProperty()
  isRTL: boolean;

  @ApiModelProperty()
  contentVersion: string;

    constructor(appUserID: string, deviceID: string, productID: string, sessionID: string,
                userType: number, ageOptIn: Signed, signUpProcess: Signed, legal: Signed, contentVersion: string, operatorsList?: Provider[], isRTL?: boolean) {
        this.appUserID = appUserID;
        this.deviceID = deviceID;
        this.productID = productID;
        this.sessionID = sessionID;
        this.userType = userType;
        this.ageOptIn = ageOptIn;
        this.signUpProcess = signUpProcess;
        this.legal = legal;
        this.contentVersion = contentVersion;
        this.operatorsList = operatorsList;
        this.isRTL = isRTL;
    }
}
