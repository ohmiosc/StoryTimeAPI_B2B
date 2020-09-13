resource "aws_dynamodb_table" "Installation" {
  name            = "${var.env_name}_Installation"

  read_capacity   = 5
  write_capacity  = 5

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  tags = {
    Name          = "Installation"
    Environment   = "${var.env_name}"
  }
}