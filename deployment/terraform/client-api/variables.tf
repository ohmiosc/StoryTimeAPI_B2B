variable "role" {}

variable "env_id" {}
variable "env_name" {}
variable "function_prefix" {}
variable "api_gateway_prefix" {}
variable "aws_account_id" {}
variable "aws_region" {}

variable "runtime_java8" { default = "java8" }
variable "runtime_nodejs8_10" { default = "nodejs10.x" }
variable "runtime_python3_6" { default = "python3.6" }
variable "client_auth_email" {}
variable "google_auth_private_key" {}
variable "send_grid_key" {}
variable "contact_us_sender_email" {}
variable "contact_us_recipient_email" {}


variable "api_version" {}
variable "build_number" {}

variable "s3_tools_bucket" {}
