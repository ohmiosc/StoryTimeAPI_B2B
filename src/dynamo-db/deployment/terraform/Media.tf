resource "aws_dynamodb_table" "media" {
  name            = "${var.env_name}_Media"

  read_capacity   = 8
  write_capacity  = 1

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  attribute {
    name  = "productId"
    type  = "S"
  }

  global_secondary_index {
    name               = "id-productId-index"
    hash_key           = "id"
    range_key          = "productId"
    read_capacity      = 2
    write_capacity     = 1
    projection_type    = "ALL"
  }

  tags = {
    Name          = "Media"
    Environment   = "${var.env_name}"
  }
}