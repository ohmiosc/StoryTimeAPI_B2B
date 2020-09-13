resource "aws_dynamodb_table" "subscription_history" {
  name            = "${var.env_name}_SubscriptionHistory"

  read_capacity   = 2
  write_capacity  = 1

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  tags = {
    Name          = "SubscriptionHistory"
    Environment   = "${var.env_name}"
  }
}