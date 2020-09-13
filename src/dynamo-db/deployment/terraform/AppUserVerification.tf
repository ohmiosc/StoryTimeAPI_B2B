resource "aws_dynamodb_table" "app_user_type_verification" {
  name            = "${var.env_name}_AppUserVerification"

  read_capacity   = 1
  write_capacity  = 1

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  tags = {
    Name          = "AppUserVerification"
    Environment   = "${var.env_name}"
  }
}