import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppUserService } from './services/app_user_service';
import { AppUserDAO } from './dao/app_user_dao';
import { LaunchAppService } from './services/launch_app_service';
import { SubscriptionHistoryDAO } from './dao/subscription_history_dao';
import { DeviceDAO } from './dao/device_dao';
import { InstallationDAO } from './dao/installation_dao';
import { Logger } from './lib/logger';
import { SessionDAO } from './dao/session_dao';
import { requestValidatorMiddleware } from './middlewares/validation.middleware';
import { launchApplicationSchema } from './validationShchemas/launchApplication.schema';
import { legalSignedSchema } from './validationShchemas/legalSigned.schema';
import { loginAlternative } from './validationShchemas/loginAlternative.schema';
import { loginRegular } from './validationShchemas/loginRegular.schema';
import { logoutSchema } from './validationShchemas/logout.schema';
import { LookupBillingDAO } from './dao/lookup_billing_dao';
import { LookupCountryDAO } from './dao/lookup_country_dao';
import * as constants from './constants';
import { OperatorDAO } from './dao/operator_dao';
import { LoginAlternativeService } from './services/login_alternative_service';
import { LoginRegularService } from './services/login_regular_service';
import { LogoutService } from './services/logout_service';
import { ProductDAO } from './dao/product_dao';
import { singUpSchema } from './validationShchemas/singUp.schema';
import { SignUpService } from './services/sign_up_service';
import { EmailService } from './services/email_service';
import { VerificationTokenDAO } from './dao/verification_token_dao';
import { validateEmailSchema } from './validationShchemas/validateEmail.schema';
import { StoreService } from './services/store_service';
import { validateVoucher } from './validationShchemas/validateVoucher.schema';
import { AppUserProductProgressionDAO } from './dao/app_user_product_progression_dao';
import { AppUserProgressionQuestionsByProductDAO } from './dao/app_user_product_progression_by_questions_dao';
import { AppUserProgressionVideosByProductDAO } from './dao/app_user_product_progression_by_video_dao';
import { AppUserProgressionDAO } from './dao/progress_dao';
import { ChangeLanguageService } from './services/change_language_service';
import { ProgressService } from './services/progress_service';
import { VocabsService } from './services/vocabs_service';
import { VideosService } from './services/videos_service';
import { ContentController } from './controller/content.controller';
import { ProgressController } from './controller/progress_controller';
import { ClientVersionDAO } from './dao/client_version_dao';
import { CollectionDAO } from './dao/collection_dao';
import { ContentVersionDAO } from './dao/content_version_dao';
import { GameDAO } from './dao/game_dao';
import { StarsProgressDAO } from './dao/star_progress_dao';
import { VideoDAO } from './dao/video_dao';
import { SpinnerGameProgressDAO } from './dao/user_data_dao';
import { BigDataService } from './services/big_data_service';
import { ContentService } from './services/content_service';
import { PageProgressService } from './services/page_progress_service';
import { SpinnerGameProgressService } from './services/spinner_game_progress_service';
import { StarProgressService } from './services/star_progress_service';
import { WebService } from './services/web_service';

@Module({
  imports: [],
  controllers: [AppController, ContentController, ProgressController],
  providers: [
    AppUserService,
    AppUserDAO,
    DeviceDAO,
    LaunchAppService,
    StoreService,
    Logger,
    InstallationDAO,
    SubscriptionHistoryDAO,
    SessionDAO,
    LookupBillingDAO,
    LookupCountryDAO,
    LoginAlternativeService,
    LoginRegularService,
    OperatorDAO,
    ChangeLanguageService,
    ProgressService,
    VocabsService,
    VideosService,
    ClientVersionDAO,
    CollectionDAO,
    ContentVersionDAO,
    GameDAO,
    StarsProgressDAO,
    VideoDAO,
    SpinnerGameProgressDAO,

    BigDataService,
    ContentService,
    PageProgressService,
    SpinnerGameProgressService,
    StarProgressService,
    WebService,
    AppUserProductProgressionDAO,
    AppUserProgressionDAO,
    AppUserProgressionQuestionsByProductDAO,
    AppUserProgressionVideosByProductDAO,
    LogoutService,
    ProductDAO,
    SignUpService,
    EmailService,
    VerificationTokenDAO,
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(requestValidatorMiddleware(launchApplicationSchema)).forRoutes(constants.LAUNCH_APPLICATION_PATH);
    consumer.apply(requestValidatorMiddleware(legalSignedSchema)).forRoutes(constants.LEGAL_SIGNED_PATH);
    consumer.apply(requestValidatorMiddleware(loginAlternative)).forRoutes(constants.LOGIN_ALTERNATIVE_PATH);
    consumer.apply(requestValidatorMiddleware(loginRegular)).forRoutes(constants.LOGIN_REGULAR_PATH);
    consumer.apply(requestValidatorMiddleware(logoutSchema)).forRoutes(constants.LOGOUT_PATH);
    consumer.apply(requestValidatorMiddleware(singUpSchema)).forRoutes(constants.SIGN_UP_PATH);
    consumer.apply(requestValidatorMiddleware(validateEmailSchema)).forRoutes(constants.VALIDATE_EMAIL_PATH);
    consumer.apply(requestValidatorMiddleware(validateVoucher)).forRoutes(constants.VALIDATE_VOUCHER_PATH);
  }
}
