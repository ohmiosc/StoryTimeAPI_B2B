terraform {
  backend "s3" {
    region              = "us-east-1"
    bucket              = "magicalenglish-ci"
    key                 = "ci/terraform/webhooks.tfstate"
  }
}
