resource "aws_dynamodb_table" "game" {
  name            = "${var.env_name}_Game"

  read_capacity   = 2
  write_capacity  = 1

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  attribute {
    name  = "gameId"
    type  = "S"
  }

  global_secondary_index {
    name               = "gameId-index"
    hash_key           = "gameId"
    read_capacity      = 3
    write_capacity     = 1
    projection_type    = "ALL"
  }

  tags = {
    Name          = "Game"
    Environment   = "${var.env_name}"
  }
}