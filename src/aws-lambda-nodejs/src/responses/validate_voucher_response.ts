import { Legal } from '../models/legal_model';
import { AgeOptIn} from '../models/age_optin_model';
import { SignUpProcess } from '../models/signed_up_process_model';
import { ApiModelProperty } from '@nestjs/swagger';

export class ValidateVoucherResponse {

  @ApiModelProperty()
  status: string;

  @ApiModelProperty()
  statusCode: number;

  @ApiModelProperty()
  message: string;

  @ApiModelProperty({type: AgeOptIn})
  ageOptIn?: AgeOptIn;

  @ApiModelProperty()
  appUserID?: string;

  @ApiModelProperty()
  deviceID?: string;

  @ApiModelProperty()
  failureReason?: number;

  @ApiModelProperty()
  isSucceeded?: number;

  @ApiModelProperty({type: Legal})
  legal?: Legal;

  @ApiModelProperty()
  productID?: string;

  @ApiModelProperty({type: SignUpProcess})
  signUpProcess?: SignUpProcess;

  @ApiModelProperty()
  userType?: number;

    constructor(status: string, statusCode: number, message: string, ageOptIn?: AgeOptIn, appUserID?: string, deviceID?: string,
                failureReason?: number, isSucceeded?: number, legal?: Legal, productID?: string,
                signUpProcess?: SignUpProcess, userType?: number) {
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
        this.ageOptIn = ageOptIn;
        this.appUserID = appUserID;
        this.deviceID = deviceID;
        this.failureReason = failureReason;
        this.isSucceeded = isSucceeded;
        this.legal = legal;
        this.productID = productID;
        this.signUpProcess = signUpProcess;
        this.userType = userType;
    }
}
