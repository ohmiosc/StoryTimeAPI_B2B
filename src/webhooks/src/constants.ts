// routes
export const ANDROID_HANDLER_PATH = 'android/subscription';
export const APPLE_HANDLER_PATH = 'apple/subscription';

// google api
export const GOOGLE_AUTH_CLIENT_EMAIL = process.env.GOOGLE_AUTH_CLIENT_EMAIL;
export const GOOGLE_AUTH_PRIVATE_KEY = process.env.GOOGLE_AUTH_PRIVATE_KEY;

// statuses
export const OK = {statusCode: 200, status: 'OK'};
export const BAD_REQUEST = {statusCode: 400, status: 'Bad Request'};

// google notifications' types
export const GOOGLE_ORIGINAL_PURCHASE = 4;
export const GOOGLE_RENEW = 2;
export const GOOGLE_CANCELLATION = 3;

// apple notifications' types
export const APPLE_RENEW = 'RENEWAL';


//env
export const DEV = 'dev';
export const QA = 'qa';
export const PROD = 'prod';


// tables
export const APP_USER_TABLE = `_AppUser`;
export const SUBSCRIPTION_HISTORY_TABLE = `_SubscriptionHistory`;
export const APP_USER_TYPE_HISTORY_TABLE = `_AppUserTypeHistory`;
export const TRANSACTION_TABLE = `_Transaction`;

// stores' ids
export const APP_STORE_ID = 1;
export const GOOGLE_PLAY_ID = 2;

export const APPSFLYER_KEY = process.env.APPSFLYER_KEY;
