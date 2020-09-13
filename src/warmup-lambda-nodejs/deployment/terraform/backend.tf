terraform {
  backend "s3" {
    region              = "eu-central-1"
    bucket              = "lamark-ci"
    key                 = "ci/terraform/warmup.tfstate"
  }
}