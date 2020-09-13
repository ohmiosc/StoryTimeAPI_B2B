import { Body, Controller, Post } from '@nestjs/common';
import { ErrorResponse } from '../responses/error_response';
import * as constants from '../constants';
import { LaunchAppService } from '../services/launch_app_service';
import { LaunchAppResponse } from '../responses/launch_app_response';
import { Logger } from '../lib/logger';
import { LegalSignedResponse } from '../responses/legal_signed_respose';
import { AppUserService } from '../services/app_user_service';
import { LoginAlternativeService } from '../services/login_alternative_service';
import { LoginAlternativeResponse } from '../responses/login_alternative_respose';
import { LoginRegularService } from '../services/login_regular_service';
import { LogoutService } from '../services/logout_service';
import { SignUpService } from '../services/sign_up_service';
import { EmailService } from '../services/email_service';
import { LogoutResponse } from '../responses/logout_response';
import { LoginRegularResponse } from '../responses/login_regular_response';
import { SignUpResponse } from '../responses/sign_up_response';
import {
  ValidatePasswordResponse,
  ValidateEmailResponse
} from '../responses/validate_email_response';
import { SendEmailResponse } from '../responses/send_email_response';
import { IAPReceiptResponse } from '../responses/iap_receipt_response';
import {StoreService} from '../services/store_service';
import {ValidateVoucherResponse} from '../responses/validate_voucher_response';
import {ChangeLanguageService} from '../services/change_language_service';
import { ChangeLanguageResponse } from '../responses/change_language_response';
import { GetAppUserByIdResponse } from '../responses/get_app_user_by_id_response';
import { SaveOptinResponse } from '../responses/save_optin_response';
import { AppUserProgressionQuestionsByProduct } from '../models/app_user_product_progression_by_questions_model';
import {ProgressService} from '../services/progress_service';
import { SaveUserProgressionQuestionsResponse} from '../responses/save_user_progression_questions_response';
import { GetVocabsUserResponse, VocabsUserResponse } from '../responses/vocabs_user_response';
import { VideosUserResponse } from '../responses/videos_user_response';
import {VideosService} from '../services/videos_service';
import {VocabsService} from '../services/vocabs_service';
import {
  AppUserProgressionVideosByProduct,
} from '../models/app_user_product_progression_by_video_model';
import { UpdateUserTypeResponse } from '../responses/update_user_type_response';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { LegalSignedRequest } from '../requests/legal_signed_request';
import { LoginAlternativeRequest } from '../requests/login_alternative_request';
import { LogoutRequest } from '../requests/logout_request';
import { SignUpRequest } from '../requests/sign_up_request';
import { ValidateEmailRequest } from '../requests/validate_email_request';
import { ResetPasswordRequest } from '../requests/reset_password_request';
import { ValidatePasswordRequest } from '../requests/validate_password_request';
import { InAppReceiptRequest } from '../requests/inapp_receipt_request';
import { ValidateVaucherRequest } from '../requests/validate_vaucher_request';
import { ChangeLanguageRequest } from '../requests/change_language_request';
import { UserByIdRequest } from '../requests/get_user_by_id_request';
import { SaveOptinRequest } from '../requests/save_optin_request';
import { GetQuestionsRequest } from '../requests/get_questions_request';
import { SaveQuestionsRequest } from '../requests/save_questions_request';
import { SaveVideosRequest } from '../requests/save_videos_request';
import { SaveVocabsRequest } from '../requests/save_vocabs_request';
import { GetVideosRequest } from '../requests/get_videos_request';
import { SendWelcomeEmailRequest } from '../requests/send_welcome_email_request';
import { UpdateUserTypeRequest } from '../requests/update_user_type_request';
import { AppUserProductProgression } from '../models/app_user_product_progression_model';
import { LaunchAppRequest } from '../requests/launch_application_request';
import { LoginRegularRequest } from '../requests/login_regular_request';
import { BigDataResponse } from '../responses/big_data_response';
import { BigDataRequest } from '../requests/bigdata_request';
import { BigDataService } from '../services/big_data_service';
import { SESEmailSenderResponse } from '../lib/ses_email_sender';
import { ContactUsRequest } from '../requests/contact_us_request';
import { ContactUsWebRequest } from '../requests/contact_us_web_request';
import { WebService } from '../services/web_service';

@Controller()
export class AppController {
  constructor(private launchAppService: LaunchAppService,
              private logger: Logger,
              private appUserService: AppUserService,
              private loginAlternativeService: LoginAlternativeService,
              private loginRegularService: LoginRegularService,
              private logoutService: LogoutService,
              private signUpService: SignUpService,
              private storeService: StoreService,
              private changeLanguageService: ChangeLanguageService,
              private progressService: ProgressService,
              private videosService: VideosService,
              private vocabsService: VocabsService,
              private bigDataService: BigDataService,
              private emailService: EmailService,
              private webService: WebService
  ) {
  }

  @Post(constants.LAUNCH_APPLICATION_PATH)
  @ApiOkResponse({ description: 'Successful response', type: LaunchAppResponse })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal server error response.', type: ErrorResponse })
  public async launchApplication(@Body() input: LaunchAppRequest): Promise<LaunchAppResponse | ErrorResponse> {
    Logger.info(`Running launch application with input = ${JSON.stringify(input)}`);
    const response: LaunchAppResponse | ErrorResponse = await this.launchAppService.launchApp(input);
    Logger.info(`LaunchApplicationAPI returns ${JSON.stringify(response)}`);
    return response;
  }

  @Post(constants.LEGAL_SIGNED_PATH)
  @ApiOkResponse({ description: 'Successful response', type: LegalSignedResponse })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
  public async signLegal(@Body() input: LegalSignedRequest): Promise<LegalSignedResponse | ErrorResponse> {
    console.log('Running LegalSigned with input = ' + JSON.stringify(input));
    const response: (LegalSignedResponse | ErrorResponse) = await this.appUserService.signLegal(input);
    console.log('LegalSigned API returns ' + JSON.stringify(response));
    return response;
  }

  @Post(constants.LOGIN_ALTERNATIVE_PATH)
  @ApiOkResponse({ description: 'Successful response', type: LoginAlternativeResponse })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
  public async loginAlternative(@Body() input: LoginAlternativeRequest): Promise<LoginAlternativeResponse | ErrorResponse> {
    console.log('Running LoginAlternative with input = ' + JSON.stringify(input));
    const response: (LoginAlternativeResponse | ErrorResponse) = await this.loginAlternativeService.loginAlternative(input);
    console.log('LoginAlternative API returns ' + JSON.stringify(response));
    return response;
  }

  @Post(constants.LOGIN_REGULAR_PATH)
  @ApiOkResponse({ description: 'Successful response', type: LoginRegularResponse })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal server error response.', type: ErrorResponse })
  public async loginRegular(@Body() input: LoginRegularRequest): Promise<LoginRegularResponse | ErrorResponse> {
    console.log('Running LoginRegular with input = ' + JSON.stringify(input));
    const response: (LoginRegularResponse | ErrorResponse) = await this.loginRegularService.loginRegular(input);
    console.log('LoginRegular API returns ' + JSON.stringify(response));
    return response;
  }

  @Post(constants.LOGOUT_PATH)
  @ApiOkResponse({ description: 'Successful response', type: LogoutResponse })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
  public async logout(@Body() input: LogoutRequest): Promise<LogoutResponse | ErrorResponse> {
    console.log('Running Logout with input = ' + JSON.stringify(input));
    const response: (LogoutResponse | ErrorResponse) = await this.logoutService.logout(input);
    console.log('Logout API returns ' + JSON.stringify(response));
    return response;
  }

  @Post(constants.SIGN_UP_PATH)
  @ApiOkResponse({ description: 'Successful response', type: SignUpResponse })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal server error response.', type: ErrorResponse })
  public async signup(@Body() input: SignUpRequest): Promise<SignUpResponse | ErrorResponse> {
    console.log('Running Signup with input = ' + JSON.stringify(input));
    const response: (SignUpResponse | ErrorResponse) = await this.signUpService.signUp(input);
    console.log('Signup API returns ' + JSON.stringify(response));
    return response;
  }

  @Post(constants.VALIDATE_EMAIL_PATH)
  @ApiOkResponse({ description: 'Successful response', type: ValidateEmailResponse })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal server error response.', type: ErrorResponse })
  public async validateEmail(@Body() input: ValidateEmailRequest): Promise<ValidateEmailResponse | ErrorResponse> {
    console.log('Running ValidateEmail with input = ' + JSON.stringify(input));
    const response: (ValidateEmailResponse | ErrorResponse) = await this.emailService.validateEmail(input);
    console.log('ValidateEmail API returns ' + JSON.stringify(response));
    return response;
  }

  @Post(constants.RESET_PASSWORD_PATH)
  @ApiOkResponse({ description: 'Successful response', type: SendEmailResponse })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal server error response.', type: ErrorResponse })
  public async resetPassword(@Body() input: ResetPasswordRequest): Promise<SendEmailResponse | ErrorResponse> {
    console.log('Running reset password with input = ' + JSON.stringify(input));
    const response: (SendEmailResponse | ErrorResponse) = await this.emailService.resetPassword(input);
    console.log('ResetPassword API returns ' + JSON.stringify(response));
    return response;
  }

  @Post(constants.VALIDATE_PASSWORD_PATH)
  @ApiOkResponse({ description: 'Successful response', type: ValidatePasswordResponse })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal server error response.', type: ErrorResponse })
  public async validatePassword(@Body() input: ValidatePasswordRequest): Promise<ValidatePasswordResponse | ErrorResponse> {
    console.log('Running validate password with input = ' + JSON.stringify(input));
    const response: (ValidatePasswordResponse | ErrorResponse) = await this.emailService.validatePassword(input);
    console.log('ValidatePassword API returns ' + JSON.stringify(response));
    return response;
  }

    @Post(constants.SEND_IAP_RECEIPT_PATH)
    @ApiOkResponse({ description: 'Successful response', type: IAPReceiptResponse })
    @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
    @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal server error response.', type: ErrorResponse })
    public async sendIAPReceipt(@Body() input: InAppReceiptRequest): Promise<IAPReceiptResponse | ErrorResponse> {
        console.log('Running Send IAP Receipt with input = ' + JSON.stringify(input));
        const response: (IAPReceiptResponse | ErrorResponse) = await this.storeService.sendIAPReceipt(input);
        console.log('SendIAPReceiptAPI returns ' + JSON.stringify(response));
        return response;
    }

    @Post(constants.VALIDATE_VOUCHER_PATH)
    @ApiOkResponse({ description: 'Successful response', type: ValidateVoucherResponse })
    @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
    @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal server error response.', type: ErrorResponse })
    public async validateVoucher(@Body() input: ValidateVaucherRequest): Promise<ValidateVoucherResponse | ErrorResponse> {
        console.log('Running Validate Voucher with input = ' + JSON.stringify(input));
        const response: (ValidateVoucherResponse | ErrorResponse) = await this.loginAlternativeService.validateVoucher(input);
        console.log('ValidateVoucherAPI returns ' + JSON.stringify(response));
        return response;
    }

    @Post(constants.CHANGE_LANGUAGE_PATH)
    @ApiOkResponse({ description: 'Successful response', type: ChangeLanguageResponse })
    @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
    @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
    public async changeLanguage(@Body() input: ChangeLanguageRequest): Promise<ChangeLanguageResponse | ErrorResponse> {
        console.log('Running ChangeLanguage with input = ' + JSON.stringify(input));
        const response: (ChangeLanguageResponse | ErrorResponse) = await this.changeLanguageService.changeLanguage(input);
        console.log('ChangeLanguage API returns ' + JSON.stringify(response));
        return response;
    }

    @Post(constants.GET_APP_USER_PATH)
    @ApiOkResponse({ description: 'Successful response', type: GetAppUserByIdResponse })
    @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
    @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal server error response.', type: ErrorResponse })
    public async getAppUser(@Body() input: UserByIdRequest): Promise<GetAppUserByIdResponse | ErrorResponse> {
        console.log('Running getAppUser with input = ' + JSON.stringify(input));
        const response: (GetAppUserByIdResponse | ErrorResponse) = await this.appUserService.getAppUser(input);
        console.log('GetAppUserAPI returns ' + JSON.stringify(response));
        return response;
    }

    @Post(constants.SAVE_OPTIN_PATH)
    @ApiOkResponse({ description: 'Successful response', type: SaveOptinResponse })
    @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
    @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
    public async saveOptin(@Body() input: SaveOptinRequest): Promise<SaveOptinResponse | ErrorResponse> {
        console.log('Running SaveOptin with input = ' + JSON.stringify(input));
        const response: (SaveOptinResponse | ErrorResponse) = await this.appUserService.saveOptin(input);
        console.log('SaveOptin API returns ' + JSON.stringify(response));
        return response;
    }

    @Post(constants.GET_QUESTIONS_USER_DATA_PATH)
    @ApiOkResponse({ description: 'Successful response', type: AppUserProgressionQuestionsByProduct })
    @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
    @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
    public async getProgressionQuestions(@Body() input: GetQuestionsRequest): Promise<AppUserProgressionQuestionsByProduct | ErrorResponse> {
        console.log('Running questionsuserdata API with input = ' + JSON.stringify(input));
        const response: (AppUserProgressionQuestionsByProduct | ErrorResponse) = await this.progressService.getProgressionQuestions(input);
        console.log('Questions questionsuserdata API returns ' + JSON.stringify(response));
        return response;
    }

    @Post(constants.SAVE_QUESTIONS_USER_DATA_PATH)
    @ApiOkResponse({ description: 'Successful response', type: SaveUserProgressionQuestionsResponse })
    @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
    @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
    public async saveProgressionQuestions(@Body() input: SaveQuestionsRequest): Promise<SaveUserProgressionQuestionsResponse | ErrorResponse> {
        console.log('Running questionsuserdata API with input = ' + JSON.stringify(input));
        const response: (SaveUserProgressionQuestionsResponse | ErrorResponse) = await this.progressService.saveProgressionQuestions(input);
        console.log('Questions questionsuserdata API returns ' + JSON.stringify(response));
        return response;
    }

    @Post(constants.VIDEOS_USER_DATA_PATH)
    @ApiOkResponse({ description: 'Successful response', type: VideosUserResponse })
    @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
    @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal server error response.', type: ErrorResponse })
    public async saveAppUserProgressionVideos(@Body() input: SaveVideosRequest): Promise<VideosUserResponse | ErrorResponse> {
        console.log('Running SaveAppUserProgressionVideos with input = ' + JSON.stringify(input));
        const response: (VideosUserResponse | ErrorResponse) = await this.videosService.saveAppUserProgressionVideos(input);
        console.log('SaveAppUserProgressionVideosAPI returns ' + JSON.stringify(response));
        return response;
    }

    @Post(constants.VOCABS_USER_DATA_PATH)
    @ApiOkResponse({ description: 'Successful response', type: VocabsUserResponse })
    @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
    @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal server error response.', type: ErrorResponse })
    public async saveAppUserProgressionVocabs(@Body() input: SaveVocabsRequest): Promise<VocabsUserResponse | ErrorResponse> {
        console.log('Running SaveAppUserProgressionVocabs with input = ' + JSON.stringify(input));
        const response: (VocabsUserResponse | ErrorResponse) = await this.vocabsService.saveAppUserProgressionVocabs(input);
        console.log('SaveAppUserProgressionVocabsAPI returns ' + JSON.stringify(response));
        return response;
    }

    @Post(constants.GET_VIDEOS_DATA_PATH)
    @ApiOkResponse({ description: 'Successful response', type: AppUserProgressionVideosByProduct })
    @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
    @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
    public async getVideosProgress(@Body() input: GetVideosRequest): Promise<AppUserProgressionVideosByProduct | ErrorResponse> {
        console.log('Running GetVideos with input = ' + JSON.stringify(input));
        const response: (AppUserProgressionVideosByProduct | ErrorResponse) = await this.videosService.getAppUserProgressionVideos(input);
        console.log('GetVideos API returns ' + JSON.stringify(response));
        return response;
    }

    @Post(constants.VOCABS_GET_USER_PROGRESSION_DATA_PATH)
    @ApiOkResponse({ description: 'Successful response', type: AppUserProductProgression })
    @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
    @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal server error response.', type: ErrorResponse })
    public async getAppUserProgressionVocabs(@Body() input: GetVocabsUserResponse): Promise<AppUserProductProgression | ErrorResponse> {
        console.log('Running getAppUserProgressionVocabs with input = ' + JSON.stringify(input));
        const response: (AppUserProductProgression | ErrorResponse) = await this.vocabsService.getAppUserProgressionVocabs(input);
        console.log('getAppUserProgressionVocabs API returns ' + JSON.stringify(response));
        return response;
    }

    @Post(constants.SEND_WELCOME_EMAIL_PATH)
    @ApiOkResponse({ description: 'Successful response', type: SendEmailResponse })
    @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
    @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
    public async sendWelcomeEmail(@Body() input: SendWelcomeEmailRequest): Promise<SendEmailResponse | ErrorResponse> {
        console.log('Running SendWelcomeEmail with input = ' + JSON.stringify(input));
        const response: (SendEmailResponse | ErrorResponse) = await this.emailService.sendWelcomeEmail(input);
        console.log('SendWelcomeEmail API returns ' + JSON.stringify(response));
        return response;
    }

    @Post(constants.UPDATE_USER_TYPE_PATH)
    @ApiOkResponse({ description: 'Successful response', type: UpdateUserTypeResponse })
    @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
    @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
    public async updateUserType(@Body() input: UpdateUserTypeRequest): Promise<UpdateUserTypeResponse | ErrorResponse> {
        console.log('Running UpdateUserType with input = ' + JSON.stringify(input));
        const response: (UpdateUserTypeResponse | ErrorResponse) = await this.appUserService.updateUserType(input);
        console.log('UpdateUserType API returns ' + JSON.stringify(response));
        return response;
    }

  @Post(constants.BIG_DATA_PATH)
  @ApiOkResponse({ description: 'Successful response', type: BigDataResponse })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
  public async saveBigData(@Body() input: BigDataRequest): Promise<BigDataResponse | ErrorResponse> {
    const response: (BigDataResponse | ErrorResponse) = await this.bigDataService.saveData(input);
    return response;
  }

  @Post(constants.CONTACT_US_PATH)
  @ApiOkResponse({ description: 'Successful response', type: SESEmailSenderResponse })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
  public async contactUS(@Body() input: ContactUsRequest): Promise<SESEmailSenderResponse | ErrorResponse> {
    console.log('Running contact us API with input = ' + JSON.stringify(input));
    const response: (SESEmailSenderResponse | ErrorResponse) = await this.emailService.sendContactUsEmail(input);
    console.log('Contact us API returns ' + JSON.stringify(response));
    return response;
  }

  @Post(constants.CONTACT_US_WEB)
  @ApiOkResponse({ description: 'Successful response', type: SESEmailSenderResponse })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
  public async contactUSWeb(@Body() input: ContactUsWebRequest): Promise<SESEmailSenderResponse | ErrorResponse> {
    console.log('Running contact us WEB API with input = ' + JSON.stringify(input));
    const response: (SESEmailSenderResponse | ErrorResponse) = await this.webService.sendContactUsEmail(input);
    console.log('Contact us WEB API returns ' + JSON.stringify(response));
    return response;
  }

}
