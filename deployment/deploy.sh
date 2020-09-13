#!/usr/bin/env bash

export TF_VAR_app_prefix="kantoo-${TF_VAR_env_id}_"
export TF_VAR_app_client_prefix="kantoo-${TF_VAR_env_id}_"
export TF_VAR_app_cms_prefix="kantoo-cms-${TF_VAR_env_id}_"
export TF_VAR_api_gateway_prefix="kantoo.${TF_VAR_env_id}."
# export TF_VAR_s3_tools_bucket="lamark-ci"
# export TF_VAR_s3_tools_bucket="kantoo.b2c.tools"

# Update backend file
cat > ./terraform/backend.tf << EOF
terraform {
  backend "s3" {
    region              = "${TF_VAR_aws_region}"
    bucket              = "${TF_VAR_s3_tools_bucket}"
    key                 = "ci/terraform/${TF_VAR_env_id}.tfstate"
  }
}
EOF

# Override
export TF_VAR_env_name=${TF_VAR_db_prefix}

cd ./terraform && terraform init -input=false

cd ../../deployment/terraform

echo "Plan & Apply"
terraform plan -state=merged-state.tfstate -out=tfplan -input=false
terraform apply -input=false tfplan