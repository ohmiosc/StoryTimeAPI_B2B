resource "aws_dynamodb_table" "language" {
  name            = "${var.env_name}_Language"

  read_capacity   = 1
  write_capacity  = 1

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  tags = {
    Name          = "Language"
    Environment   = "${var.env_name}"
  }
}