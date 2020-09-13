# Client API
resource "aws_api_gateway_rest_api" "kantoo_client_api" {
  name              = "${var.api_gateway_prefix}client-api"
  description       = ""
}

#app_proxy resource
resource "aws_api_gateway_resource" "app_proxy" {
   rest_api_id       = "${aws_api_gateway_rest_api.kantoo_client_api.id}"
   parent_id         = "${aws_api_gateway_rest_api.kantoo_client_api.root_resource_id}"
   path_part         = "{proxy+}"
 }

# Deployment
resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id       = "${aws_api_gateway_rest_api.kantoo_client_api.id}"
  stage_name        = "${var.env_name}"

  variables = {
    "lambdaAlias"   = "${var.env_name}-${var.build_number}"
    "stageName"     = "${var.env_name}"
  }

  lifecycle {
    create_before_destroy = true
  }
}



