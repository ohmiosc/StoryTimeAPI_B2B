resource "aws_dynamodb_table" "video" {
  name            = "${var.env_name}_Video"

  read_capacity   = 2
  write_capacity  = 1

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  attribute {
    name  = "videoId"
    type  = "S"
  }

  global_secondary_index {
    name               = "videoId-index"
    hash_key           = "videoId"
    read_capacity      = 3
    write_capacity     = 1
    projection_type    = "ALL"
  }

  tags = {
    Name          = "Game"
    Environment   = "${var.env_name}"
  }
}