variable "aws_account_id" {}
variable "aws_region" {}
variable "aws_access_key" {}
variable "aws_secret_key" {}
variable "build_number" { default = "1" }

variable "runtime_java8" { default = "java8" }
variable "runtime_nodejs8_10" { default = "nodejs8.10" }
variable "runtime_python3_6" { default = "python3.6" }

variable "filename_warmup" { default = "../../kantoo.api.warmup.zip" }

provider "aws" {
  version               = "~> 1.46.0"
  region                = "${var.aws_region}"
  access_key            = "${var.aws_access_key}"
  secret_key            = "${var.aws_secret_key}"
  allowed_account_ids   = ["${var.aws_account_id}"]
}
