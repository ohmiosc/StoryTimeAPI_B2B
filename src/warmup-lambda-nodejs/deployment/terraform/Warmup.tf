resource "aws_lambda_function" "warmup" {
  function_name     = "warmup"
  handler           = "index.handler"
  role              = "arn:aws:iam::${var.aws_account_id}:role/LamarkLambdaBasicExecution"
  runtime           = "${var.runtime_nodejs8_10}"
  timeout           = "60"
  memory_size       = "512"

  filename          = "${var.filename_warmup}"
  source_code_hash  = "${md5(file("${var.filename_warmup}"))}"

  environment {
    variables = {
      FUNCTIONS = "${var.functions}",
      SIMULTANEOUS_CALLS = "5"
    }
  }
}

variable "functions" {
  type = "string"
  default = <<EOF
  kantoo-dev_GetAppUserById, kantoo-qa_GetAppUserById, kantoo-prod_GetAppUserById,
  kantoo-dev_BigData, kantoo-qa_BigData, kantoo-prod_BigData,
  kantoo-dev_EditAppUser, kantoo-qa_EditAppUser, kantoo-prod_EditAppUser,
  kantoo-dev_ResendEmailFromWeb, kantoo-qa_ResendEmailFromWeb, kantoo-prod_ResendEmailFromWeb,
  kantoo-dev_IsEmailVerified, kantoo-qa_IsEmailVerified, kantoo-prod_IsEmailVerified,
  kantoo-dev_GetAppUserProgressionQuestions, kantoo-qa_GetAppUserProgressionQuestions, kantoo-prod_GetAppUserProgressionQuestions,
  kantoo-dev_GetAppUserProgressionVideos, kantoo-qa_GetAppUserProgressionVideos, kantoo-prod_GetAppUserProgressionVideos,
  kantoo-dev_GetAppUserProgressionVocabs, kantoo-qa_GetAppUserProgressionVocabs, kantoo-prod_GetAppUserProgressionVocabs,
  kantoo-dev_LaunchApplication, kantoo-qa_LaunchApplication, kantoo-prod_LaunchApplication,
  kantoo-dev_LegalSignedFinished, kantoo-qa_LegalSignedFinished, kantoo-prod_LegalSignedFinished,
  kantoo-dev_LogInAlternative, kantoo-qa_LogInAlternative, kantoo-prod_LogInAlternative,
  kantoo-dev_LoginRegular, kantoo-qa_LoginRegular, kantoo-prod_LoginRegular,
  kantoo-dev_LogOutAppUser, kantoo-qa_LogOutAppUser, kantoo-prod_LogOutAppUser,
  kantoo-dev_SaveAppUserProgressionQuestions, kantoo-qa_SaveAppUserProgressionQuestions, kantoo-prod_SaveAppUserProgressionQuestions,
  kantoo-dev_EmailVerificationRequest, kantoo-qa_EmailVerificationRequest, kantoo-prod_EmailVerificationRequest,
  kantoo-dev_ResetPassword, kantoo-qa_ResetPassword, kantoo-prod_ResetPassword,
  kantoo-dev_SaveOptin, kantoo-qa_SaveOptin, kantoo-prod_SaveOptin,
  kantoo-dev_SendIAPReceipt, kantoo-qa_SendIAPReceipt, kantoo-prod_SendIAPReceipt,
  kantoo-dev_SendWelcomeEmail, kantoo-qa_SendWelcomeEmail, kantoo-prod_SendWelcomeEmail,
  kantoo-dev_SignUp, kantoo-qa_SignUp, kantoo-prod_SignUp,
  kantoo-dev_UpdateUserType, kantoo-qa_UpdateUserType, kantoo-prod_UpdateUserType,
  kantoo-dev_EmailValidation, kantoo-qa_EmailValidation, kantoo-prod_EmailValidation,
  kantoo-dev_PasswordValidation, kantoo-qa_PasswordValidation, kantoo-prod_PasswordValidation,
  kantoo-dev_SaveAppUserProgressionVideos, kantoo-qa_SaveAppUserProgressionVideos, kantoo-prod_SaveAppUserProgressionVideos,
  kantoo-dev_SaveAppUserProgressionVocabs, kantoo-qa_SaveAppUserProgressionVocabs, kantoo-prod_SaveAppUserProgressionVocabs,
  IP_geolocation, getUserState_fromMysql
  EOF
}


# Cloudwatch Event
resource "aws_cloudwatch_event_rule" "warmup" {
  name                = "kantoo-lambda-warmup"
  description         = "Fires every 2 minutes"
  schedule_expression = "rate(2 minutes)"
}

resource "aws_cloudwatch_event_target" "check_warmup" {
  rule            = "${aws_cloudwatch_event_rule.warmup.name}"
  target_id       = "${aws_lambda_function.warmup.function_name}"
  arn             = "${aws_lambda_function.warmup.arn}"
}

resource "aws_lambda_permission" "warmup" {
  action          = "lambda:InvokeFunction"
  function_name   = "${aws_lambda_function.warmup.function_name}"
  principal       = "events.amazonaws.com"
  source_arn      = "${aws_cloudwatch_event_rule.warmup.arn}"
}