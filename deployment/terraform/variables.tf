variable "aws_account_id" {}
variable "aws_region" {}
variable "aws_access_key" {}
variable "aws_secret_key" {}


variable "env_id" { default = "dev" }
variable "env_name" { default = "dev" }
variable "api_version" { default = "0.1" }
variable "build_number" { default = "1" }
variable "s3_tools_bucket" { default = "kantoo.tools" }
variable "client_auth_email" {}
variable "google_auth_private_key" {}
variable "send_grid_key" {}
variable "contact_us_sender_email" {}
variable "contact_us_recipient_email" {}

variable "app_prefix" {}
variable "app_client_prefix" {}
variable "app_cms_prefix" {}
variable "api_gateway_prefix" {}
