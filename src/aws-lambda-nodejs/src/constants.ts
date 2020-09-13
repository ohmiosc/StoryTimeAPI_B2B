// routes
export const GET_APP_USER_PATH = 'appuser';
export const LAUNCH_APPLICATION_PATH = 'appuser/launchapplication';
export const LOGIN_REGULAR_PATH = 'appuser/loginregular';
export const LOGIN_ALTERNATIVE_PATH = 'appuser/loginalternative';
export const SEND_IAP_RECEIPT_PATH = 'appuser/sendiapreceipt';
export const SIGN_UP_PATH = 'appuser/signup';
export const VALIDATE_EMAIL_PATH = 'appuser/validate';
export const RESEND_VERIFICATION_EMAIL_PATH = 'appuser/resendverificationemail';
export const RESET_PASSWORD_PATH = 'appuser/resetpassword';
export const VALIDATE_PASSWORD_PATH = 'appuser/validatepassword';
export const VOCABS_USER_DATA_PATH = 'appuser/vocabsuserdata';
export const VIDEOS_USER_DATA_PATH = 'appuser/videosuserdata';
export const CHANGE_LANGUAGE_PATH = 'appuser/edituser';
export const LOGOUT_PATH = 'appuser/logout';
export const IS_EMAIL_VERIFIED_PATH = 'appuser/getisemailverified';
export const SAVE_OPTIN_PATH = 'appuser/saveoptin';
export const LEGAL_SIGNED_PATH = 'appuser/legalsigned';
export const SEND_WELCOME_EMAIL_PATH = 'appuser/sendwelcomeemail';
export const UPDATE_USER_TYPE_PATH = 'appuser/updatetype';
export const GET_VIDEOS_DATA_PATH = 'appuser/getvideosuserdata';
export const VOCABS_GET_USER_PROGRESSION_DATA_PATH = 'appuser/getvocabsuserdata';
export const BIG_DATA_PATH = 'appuser/bigdata';
export const SAVE_QUESTIONS_USER_DATA_PATH = 'appuser/questionsuserdata';
export const GET_QUESTIONS_USER_DATA_PATH = 'appuser/getquestionsuserdata';
export const VALIDATE_VOUCHER_PATH = 'appuser/voucher';
export const CONTACT_US_PATH = 'appuser/contactus';
export const CONTACT_US_WEB = 'contactus';
export const STARS_PROGRESS_PATH = 'appuser/:id/stars';
export const SET_SPINNER_GAME_PROGRESS = 'appuser/setuserdata';
export const GET_SPINNER_GAME_PROGRESS = 'appuser/getuserdata';
export const GAME_PROGRESS_PATH = 'appuser/:id/page_progress/games/:gameId';
export const VIDEO_PROGRESS_PATH = 'appuser/:id/page_progress/videos/:videoId';
export const COLLECTION_PROGRESS_PATH = 'appuser/:id/page_progress/collections/:collectionId';
export const AVAILABLE_CONTENT_VERSIONS_PATH = 'content_versions/available';

// environment
export const ENV = process.env.ENV;

// tables
export const APP_USER_TABLE = `${ENV.toLowerCase()}_AppUser`;
export const SUBSCRIPTION_HISTORY_TABLE = `${ENV.toLowerCase()}_SubscriptionHistory`;
export const DEVICE_TABLE = `${ENV.toLowerCase()}_Device`;
export const INSTALLATION_TABLE = `${ENV.toLowerCase()}_Installation`;
export const SESSION_TABLE = `${ENV.toLowerCase()}_Session`;
export const PRODUCT_TABLE = `${ENV.toLowerCase()}_Product`;
export const APP_USER_PROGRESSION_BY_PRODUCT_TABLE = `${ENV.toLowerCase()}_AppUserProgressionByProduct`;
export const APP_USER_PROGRESSION_VIDEOS_BY_PRODUCT_TABLE = `${ENV.toLowerCase()}_AppUserProgressionVideosByProduct`;
export const APP_USER_PROGRESSION_QUESTIONS_BY_PRODUCT_TABLE = `${ENV.toLowerCase()}_AppUserProgressionQuestionsByProduct`;
export const PROGRESS_TABLE = `${ENV.toLowerCase()}_Progress`;
export const VERIFICATION_TOKEN_TABLE = `${ENV.toLowerCase()}_AppUserVerification`;
export const LOOKUP_BILLING_TABLE = `${ENV.toLowerCase()}_LookUpBilling`;
export const LOOKUP_COUNTRY_TABLE = `${ENV.toLowerCase()}_LookUpCountry`;
export const OPERATOR_TABLE = `${ENV.toLowerCase()}_Operator`;

export const WHEEL_GAME_PROGRESS_TABLE = `${ENV.toLowerCase()}_WheelGameProgress`;
export const STARS_PROGRESS_TABLE = `${ENV.toLowerCase()}_StarsProgress`;
export const GAME_TABLE = `${ENV.toLowerCase()}_Game`;
export const VIDEO_TABLE = `${ENV.toLowerCase()}_Video`;
export const COLLECTION_TABLE = `${ENV.toLowerCase()}_Collection`;
export const CONTENT_VERSION_TABLE = `${ENV.toLowerCase()}_ContentVersion`;
export const CONTENT_VERSION_TABLE_ENV = `_ContentVersion`;
export const CLIENT_VERSION_TABLE = `${ENV.toLowerCase()}_ClientVersion`;

export const GOOGLE_AUTH_CLIENT_EMAIL = process.env.GOOGLE_AUTH_CLIENT_EMAIL;
export const GOOGLE_AUTH_PRIVATE_KEY = process.env.GOOGLE_AUTH_PRIVATE_KEY;

// status errors
export const INTERNAL_SERVER_ERROR = {
  statusCode: 500,
  status: 'Internal Server Error',
};
export const NOT_FOUND = { statusCode: 404, status: 'Not found' };
export const BAD_REQUEST = { statusCode: 400, status: 'Bad Request' };
export const OK = { statusCode: 200, status: 'OK' };

// user's types
export const IAP_GUEST: number = 0;
export const IAP_SUBSCRIBED: number = 1;
export const IAP_CANCELLED: number = 2;
export const ALTERNATIVE_GUEST = 3;
export const ALTERNATIVE_SUBSCRIBED: number = 4;
export const ALTERNATIVE_CANCELLED: number = 5;
export const ALTERNATIVE_DISABLED: number = 6;

// error types
export const NO_ERROR = 0;
export const EMAIL_ALREADY_EXISTS_ERROR = 2;
export const EMAIL_DOES_NOT_EXIST_ERROR = 3;
export const INCORRECT_PASSWORD_ERROR = 4;
export const INCORRECT_MSISDN = 5;
export const CANCELLED_USE_ERROR = 6;
export const INCORRECT_EMAIL_ERROR = 9;
export const PASSWORD_IS_EMPTY_ERROR = 12;
export const INCORRECT_STORE_ID_ERROR = 21;
export const RECEIPT_IS_EMPTY_ERROR = 24;
export const APP_STORE_RECEIPT_VALIDATION_ERROR = 31;
export const CANCELLED_USER = 6;
export const DISABLED_USER = 7;
export const USER_NOT_FOUND = 16;
export const VOUCHER_VALIDATION_FAILED = 31;

// email errors
export const EMAIL_ALREADY_VALIDATED = 1;
export const TOKEN_NOT_FOUND = 2;
export const TOKEN_EXPIRED = 3;
export const TOKEN_NOT_ACTIVE = 4;
export const EMAIL_IS_EMPTY = 11;

// registration types
export const UNKNOWN = 0;
export const REGULAR = 1;
export const FACEBOOK = 2;
export const GOOGLE = 3;
export const NO_INFO = 4;

// mandrill templates
export const WELCOME_TEMPLATE_B2B = 'DST_WELCOME_PROD_';
export const VALIDATION_TEMPLATE_B2B = `DST_EMAIL_VALIDATION_B2B_${ENV.toUpperCase()}_`;
export const RESET_PASSWORD_TEMPLATE_B2B = `DST_RESET_PASSWORD_B2B_${ENV.toUpperCase()}_`;

// email subjects
export const WELCOME_EMAIL_SUBJECT = 'Welcome email';
export const VERIFICATION_EMAIL_SUBJECT = 'Email verification';
export const RESET_PASSWORD_SUBJECT = 'Password reset';

// sqs
export const QUEUE_NAME = `${ENV.toLowerCase()}_big_data_queue`;
// lookUpCountry
export const DEFAULT_COUNTRY_KEY = 'default';

export const DEFAULT_LANGUAGE = 'pt';
export const FACEBOOK_DOMAIN = 'facebook.com';

// email
export const CONTACT_US_SENDER_EMAIL = process.env.CONTACT_US_SENDER_EMAIL;
export const CONTACT_US_RECIPIENT_EMAIL = process.env.CONTACT_US_RECIPIENT_EMAIL;
export const WEB_CONTACT_US_SUBJECT = 'magicalenglish-web';
export const CONTACT_US_WEB_EMAIL_SUBJECT  = 'Confirmation email';
export const CONTACT_US_WEB_TEMPLATE_PT = `CONTACT_US_WEB_TEMPLATE_PT`;
export const CONTACT_US_WEB_TEMPLATE_ES = `CONTACT_US_WEB_TEMPLATE_ES`;
export const CONTACT_US_WEB_TEMPLATE_EN = `CONTACT_US_WEB_TEMPLATE_EN`;
export const SEND_GRID_KEY = process.env.SEND_GRID_KEY;

// content
export const CONTENT_INITIAL_VERSION = 'base';
