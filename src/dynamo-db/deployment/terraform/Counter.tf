resource "aws_dynamodb_table" "counter" {
  name            = "${var.env_name}_Counter"

  read_capacity   = 1
  write_capacity  = 1

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  tags = {
    Name          = "Counter"
    Environment   = "${var.env_name}"
  }
}