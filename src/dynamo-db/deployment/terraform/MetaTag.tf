resource "aws_dynamodb_table" "meta_tag" {
  name            = "${var.env_name}_MetaTag"

  read_capacity   = 1
  write_capacity  = 1

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  tags = {
    Name          = "MetaTag"
    Environment   = "${var.env_name}"
  }
}