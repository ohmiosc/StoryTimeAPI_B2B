resource "aws_dynamodb_table" "version" {
  name            = "${var.env_name}_Version"

  read_capacity   = 1
  write_capacity  = 1

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  tags = {
    Name          = "Version"
    Environment   = "${var.env_name}"
  }
}