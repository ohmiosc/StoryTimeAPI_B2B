resource "aws_dynamodb_table" "product" {
  name            = "${var.env_name}_Product"

  read_capacity   = 2
  write_capacity  = 1

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  tags = {
    Name          = "Product"
    Environment   = "${var.env_name}"
  }
}