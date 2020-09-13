resource "aws_iam_role" "stores_notifications" {
  name = "StoresNotifications"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": [
            "lambda.amazonaws.com",
            "apigateway.amazonaws.com",
            "states.amazonaws.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "aws_lambda_fullaccess" {
  role       = "${aws_iam_role.stores_notifications.name}"
  policy_arn = "arn:aws:iam::aws:policy/AWSLambdaFullAccess"
}

resource "aws_iam_role_policy_attachment" "aws_lambdainvocation_dynamodb_fullaccess" {
  role       = "${aws_iam_role.stores_notifications.name}"
  policy_arn = "arn:aws:iam::aws:policy/AWSLambdaInvocation-DynamoDB"
}

resource "aws_iam_role_policy_attachment" "aws_stepfunctions_fullaccess" {
  role       = "${aws_iam_role.stores_notifications.name}"
  policy_arn = "arn:aws:iam::aws:policy/AWSStepFunctionsFullAccess"
}

resource "aws_iam_role_policy_attachment" "aws_stepfunctions_console_fullaccess" {
  role       = "${aws_iam_role.stores_notifications.name}"
  policy_arn = "arn:aws:iam::aws:policy/AWSStepFunctionsConsoleFullAccess"
}

resource "aws_iam_role_policy_attachment" "amazon_dynamodb_fullaccess" {
  role       = "${aws_iam_role.stores_notifications.name}"
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_iam_role_policy_attachment" "amazon_elasticache_fullaccess" {
  role       = "${aws_iam_role.stores_notifications.name}"
  policy_arn = "arn:aws:iam::aws:policy/AmazonElastiCacheFullAccess"
}

resource "aws_iam_role_policy_attachment" "amazon_apigateway_pushto_cloudwatch_logs" {
  role       = "${aws_iam_role.stores_notifications.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs"
}

resource "aws_iam_role_policy_attachment" "aws_xray_fullaccess" {
  role       = "${aws_iam_role.stores_notifications.name}"
  policy_arn = "arn:aws:iam::aws:policy/AWSXrayFullAccess"
}

resource "aws_iam_role_policy_attachment" "aws_lambdainvocation_vpc_executionaccess" {
  role       = "${aws_iam_role.stores_notifications.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "aws_sqs_access" {
  role       = "${aws_iam_role.stores_notifications.name}"
  policy_arn = "arn:aws:iam::aws:policy/AmazonSQSFullAccess"
}

