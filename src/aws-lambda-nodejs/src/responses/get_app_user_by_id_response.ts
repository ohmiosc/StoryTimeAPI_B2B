import { Provider, Signed } from './launch_app_response';
import { ApiModelProperty } from '@nestjs/swagger';

export class GetAppUserByIdResponse {

  @ApiModelProperty({type: Signed})
  ageOptIn: Signed;

  @ApiModelProperty()
  appUserID: string;

  @ApiModelProperty()
  deviceID: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  expireDate: string;

  @ApiModelProperty({type: Signed})
  legal: Signed;

  @ApiModelProperty({type: Signed})
  signUpProcess: Signed;

  @ApiModelProperty()
  productID: string;

  @ApiModelProperty({type: Signed})
  subscriptionPrice: string;

  @ApiModelProperty()
  userType: number;

  @ApiModelProperty()
  msisdn: string;

  @ApiModelProperty({type: [Provider]})
  operatorsList: Provider[];

  @ApiModelProperty()
  registeredOperatorName: string;

  constructor(ageOptIn: Signed, appUserID: string, deviceID: string, email: string, expireDate: string,
              legal: Signed, productID: string, signUpProcess: Signed, subscriptionPrice: string, userType: number,
              msisdn: string, operatorsList: Provider[], registeredOperatorName: string) {
    this.ageOptIn = ageOptIn;
    this.appUserID = appUserID;
    this.deviceID = deviceID;
    this.email = email;
    this.expireDate = expireDate;
    this.legal = legal;
    this.productID = productID;
    this.signUpProcess = signUpProcess;
    this.subscriptionPrice = subscriptionPrice;
    this.userType = userType;
    this.msisdn = msisdn;
    this.operatorsList = operatorsList;
    this.registeredOperatorName = registeredOperatorName;
  }
}
