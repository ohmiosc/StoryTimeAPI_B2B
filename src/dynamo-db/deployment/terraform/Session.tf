resource "aws_dynamodb_table" "session" {
  name            = "${var.env_name}_Session"

  read_capacity   = 5
  write_capacity  = 5

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  tags = {
    Name          = "Session"
    Environment   = "${var.env_name}"
  }
}