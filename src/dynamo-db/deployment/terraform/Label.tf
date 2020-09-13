resource "aws_dynamodb_table" "label" {
  name            = "${var.env_name}_Label"

  read_capacity   = 2
  write_capacity  = 1

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  tags = {
    Name          = "Label"
    Environment   = "${var.env_name}"
  }
}