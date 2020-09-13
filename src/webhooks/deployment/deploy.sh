#!/usr/bin/env bash

cd ./terraform && terraform init -input=false

cd ../../deployment/terraform

echo "Plan & Apply"
terraform plan -state=merged-state.tfstate -out=tfplan -input=false
terraform apply -input=false tfplan
