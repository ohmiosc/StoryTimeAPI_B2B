resource "aws_dynamodb_table" "app_user_type_history" {
  name            = "${var.env_name}_AppUserTypeHistory"

  read_capacity   = 1
  write_capacity  = 1

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  tags = {
    Name          = "AppUserTypeHistory"
    Environment   = "${var.env_name}"
  }
}