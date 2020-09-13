# Client API
resource "aws_api_gateway_rest_api" "webhook-api" {
  name              = "webhook-api"
  description       = "Handles Stores notifications"
}

#app_proxy resource
resource "aws_api_gateway_resource" "app_proxy" {
  rest_api_id       = "${aws_api_gateway_rest_api.webhook-api.id}"
  parent_id         = "${aws_api_gateway_rest_api.webhook-api.root_resource_id}"
  path_part         = "{proxy+}"
}

# Deployment
resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id       = "${aws_api_gateway_rest_api.webhook-api.id}"
  stage_name        = "prod"

  variables = {
    "stageName"     = "prod"
  }

  lifecycle {
    create_before_destroy = true
  }
}

