resource "aws_dynamodb_table" "wheel_game_progress" {
  name            = "${var.env_name}_WheelGameProgress"

  read_capacity   = 3
  write_capacity  = 1

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }


  attribute {
    name  = "appUserID"
    type  = "S"
  }

  global_secondary_index {
    name               = "appUserID-index"
    hash_key           = "appUserID"
    read_capacity      = 3
    write_capacity     = 1
    projection_type    = "ALL"
  }


  tags = {
    Name          = "WheelGameProgress"
    Environment   = "${var.env_name}"
  }
}

