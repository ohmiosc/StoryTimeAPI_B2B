resource "aws_dynamodb_table" "device" {
  name            = "${var.env_name}_Device"

  read_capacity   = 5
  write_capacity  = 5

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  tags = {
    Name          = "Device"
    Environment   = "${var.env_name}"
  }
}