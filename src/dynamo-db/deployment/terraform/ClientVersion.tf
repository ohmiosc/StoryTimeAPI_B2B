resource "aws_dynamodb_table" "client_version" {
  name            = "${var.env_name}_ClientVersion"

  read_capacity   = 2
  write_capacity  = 2

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  tags = {
    Name          = "ClientVersion"
    Environment   = "${var.env_name}"
  }
}
