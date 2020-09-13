provider "aws" {
  version               = "~> 2.11.0"
  region                = "${var.aws_region}"
  access_key            = "${var.aws_access_key}"
  secret_key            = "${var.aws_secret_key}"
  allowed_account_ids   = ["${var.aws_account_id}"]
}

module "client_api" {
  source                = "./client-api"
  role                  = "${aws_iam_role.lambda_basic_execution.arn}"
  env_id                = "${var.env_id}"
  env_name              = "${var.env_name}"
  function_prefix       = "${var.app_prefix}"
  api_gateway_prefix    = "${var.api_gateway_prefix}"
  aws_account_id        = "${var.aws_account_id}"
  aws_region            = "${var.aws_region}"
  api_version           = "${var.app_client_prefix}"
  build_number          = "${var.build_number}"
  s3_tools_bucket       = "${var.s3_tools_bucket}"
  google_auth_private_key = "${var.google_auth_private_key}"
  client_auth_email = "${var.client_auth_email}"
  send_grid_key = "${var.send_grid_key}"
  contact_us_recipient_email = "${var.contact_us_recipient_email}"
  contact_us_sender_email = "${var.contact_us_sender_email}"
}

// module "dynamo_db" {
//   source = "./dynamo-db"
//  env_name = "${var.env_name}"
// }
