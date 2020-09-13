variable "aws_account_id" {}
variable "aws_region" {}
variable "aws_access_key" {}
variable "aws_secret_key" {}
variable "build_number" { default = "1" }

provider "aws" {
  version               = "~> 2.11.0"
  region                = "${var.aws_region}"
  access_key            = "${var.aws_access_key}"
  secret_key            = "${var.aws_secret_key}"
  allowed_account_ids   = ["${var.aws_account_id}"]
}
