terraform {
  backend "s3" {
    region              = "us-east-1"
    bucket              = "magicalenglish-ci"
    key                 = "ci/terraform/b2b_dev.tfstate"
  }
}
