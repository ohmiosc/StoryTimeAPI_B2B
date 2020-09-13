 data "archive_file" "nodejs_app" {
   type          = "zip"
   source_dir    = "../../src/aws-lambda-nodejs"
   output_path   = "../../dest/nodejs_app.zip"
 }

 resource "aws_lambda_function" "nodejs_app" {
   function_name     = "${var.function_prefix}nodejs-app"
   handler           = "dist/index.handler"
   filename          = "${data.archive_file.nodejs_app.output_path}"
   source_code_hash  = "${data.archive_file.nodejs_app.output_base64sha256}"
   role              = "${var.role}"
   runtime           = "${var.runtime_nodejs8_10}"
   timeout           = "30"
   memory_size       = "3008"

   environment {
     variables = {
       BUILD_VERSION = "${var.api_version}.${var.build_number}"
       ENV = "${lower(var.env_name)}"
       GOOGLE_AUTH_CLIENT_EMAIL = "${var.client_auth_email}"
       GOOGLE_AUTH_PRIVATE_KEY = "${var.google_auth_private_key}"
       SEND_GRID_KEY = "${var.send_grid_key}"
       CONTACT_US_RECIPIENT_EMAIL="${var.contact_us_recipient_email}"
       CONTACT_US_SENDER_EMAIL="${var.contact_us_sender_email}"
     }
   }
 }

 resource "aws_api_gateway_method" "nodejs_app_any" {
   rest_api_id       = "${aws_api_gateway_rest_api.kantoo_client_api.id}"
   resource_id       = "${aws_api_gateway_rest_api.kantoo_client_api.root_resource_id}"
   http_method       = "ANY"
   authorization     = "NONE"
   request_parameters = {
     "method.request.path.proxy" = true
   }
 }

 resource "aws_api_gateway_method" "nodejs_app_proxy_any" {
   rest_api_id       = "${aws_api_gateway_rest_api.kantoo_client_api.id}"
   resource_id       = "${aws_api_gateway_resource.app_proxy.id}"
   http_method       = "ANY"
   authorization     = "NONE"
   request_parameters = {
     "method.request.path.proxy" = true
   }
 }

 # nodejs_app_any
 resource "aws_api_gateway_integration" "nodejs_app_any" {
   rest_api_id       = "${aws_api_gateway_rest_api.kantoo_client_api.id}"
   resource_id       = "${aws_api_gateway_method.nodejs_app_any.resource_id}"
   http_method       = "${aws_api_gateway_method.nodejs_app_any.http_method}"
   type              = "AWS_PROXY"
   uri               = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.nodejs_app.arn}/invocations"
   integration_http_method   = "POST"
 }

 resource "aws_api_gateway_integration" "nodejs_app_proxy_any" {
   rest_api_id       = "${aws_api_gateway_rest_api.kantoo_client_api.id}"
   resource_id       = "${aws_api_gateway_method.nodejs_app_proxy_any.resource_id}"
   http_method       = "${aws_api_gateway_method.nodejs_app_proxy_any.http_method}"
   type              = "AWS_PROXY"
   uri               = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.nodejs_app.arn}/invocations"
   integration_http_method   = "POST"
 }

 # Permissions
 resource "aws_lambda_permission" "nodejs_app" {
   action            = "lambda:InvokeFunction"
   function_name     = "${aws_lambda_function.nodejs_app.function_name}"
   principal         = "apigateway.amazonaws.com"
   source_arn        = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.kantoo_client_api.id}/*/*/*"
 }