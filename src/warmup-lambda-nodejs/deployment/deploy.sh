#!/usr/bin/env bash

export TF_VAR_s3_tools_bucket="lamark-ci"

# Update backend file
cat > ./terraform/backend.tf << EOF
terraform {
  backend "s3" {
    region              = "${TF_VAR_aws_region}"
    bucket              = "${TF_VAR_s3_tools_bucket}"
    key                 = "ci/terraform/kantoo-warmup.tfstate"
  }
}
EOF

cd ./terraform && terraform init -input=false
cd ../../deployment/terraform

echo "Plan & Apply"
terraform plan -out=tfplan -input=false
terraform apply -input=false tfplan
