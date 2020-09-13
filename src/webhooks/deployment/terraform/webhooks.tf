data "archive_file" "webhooks_server" {
  type          = "zip"
  source_dir    = "../../deploy"
  output_path   = "../../dest/webhooks.zip"
}

resource "aws_lambda_function" "webhooks" {
  function_name     = "kantoo-webhooks"
  handler           = "dist/index.handler"
  filename          = "${data.archive_file.webhooks_server.output_path}"
  source_code_hash  = "${data.archive_file.webhooks_server.output_base64sha256}"
  role              = "${aws_iam_role.stores_notifications.arn}"
  runtime           = "${var.runtime_nodejs10_x}"
  timeout           = "30"
  memory_size       = "3008"

  environment {
    variables = {
      GOOGLE_AUTH_CLIENT_EMAIL = "${var.client_auth_email}"
      GOOGLE_AUTH_PRIVATE_KEY = "${var.google_auth_private_key}"
      APPSFLYER_KEY = "${var.appsflyer_key}"
      APPCENTER_HOST = "${var.appcenter_host}"
      APPCENTER_API_KEY = "${var.appcenter_api_key}"
      UNITYCLOUD_AUTHORIZATION_TOKEN = "${var.unitycloud_authorization_token}"
      UNITYCLOUD_API_KEY = "${var.unitycloud_api_key}"
      UNITYCLOUD_API_BASE = "${var.unitycloud_api_base}"
      APP_VERSION = "${var.app_version}"
      IOS_BETA_TESTERS_ID = "${var.ios_beta_testers_id}"
      ANDROID_BETA_TESTERS_ID = "${var.android_beta_testers_id}"
    }
  }
}

resource "aws_api_gateway_method" "webhooks_handler_any" {
  rest_api_id       = "${aws_api_gateway_rest_api.webhook-api.id}"
  resource_id       = "${aws_api_gateway_rest_api.webhook-api.root_resource_id}"
  http_method       = "ANY"
  authorization     = "NONE"
  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_method" "webhooks_handler_proxy_any" {
  rest_api_id       = "${aws_api_gateway_rest_api.webhook-api.id}"
  resource_id       = "${aws_api_gateway_resource.app_proxy.id}"
  http_method       = "ANY"
  authorization     = "NONE"
  request_parameters = {
    "method.request.path.proxy" = true
  }
}

# # nodejs_app_any
resource "aws_api_gateway_integration" "webhooks_handler_any" {
  rest_api_id       = "${aws_api_gateway_rest_api.webhook-api.id}"
  resource_id       = "${aws_api_gateway_method.webhooks_handler_any.resource_id}"
  http_method       = "${aws_api_gateway_method.webhooks_handler_any.http_method}"
  type              = "AWS_PROXY"
  uri               = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.webhooks.arn}/invocations"
  integration_http_method   = "POST"
}

resource "aws_api_gateway_integration" "nodejs_app_proxy_any" {
  rest_api_id       = "${aws_api_gateway_rest_api.webhook-api.id}"
  resource_id       = "${aws_api_gateway_method.webhooks_handler_proxy_any.resource_id}"
  http_method       = "${aws_api_gateway_method.webhooks_handler_any.http_method}"
  type              = "AWS_PROXY"
  uri               = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.webhooks.arn}/invocations"
  integration_http_method   = "POST"
}

# # Permissions
resource "aws_lambda_permission" "nodejs_app" {
  action            = "lambda:InvokeFunction"
  function_name     = "${aws_lambda_function.webhooks.function_name}"
  principal         = "apigateway.amazonaws.com"
  source_arn        = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.webhook-api.id}/*/*/*"
}
