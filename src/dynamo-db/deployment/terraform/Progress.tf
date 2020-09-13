resource "aws_dynamodb_table" "progress" {
  name            = "${var.env_name}_Progress"

  read_capacity   = 3
  write_capacity  = 1

  hash_key        = "sessionID"

  attribute {
    name  = "sessionID"
    type  = "S"
  }

  tags = {
    Name          = "Progress"
    Environment   = "${var.env_name}"
  }
}