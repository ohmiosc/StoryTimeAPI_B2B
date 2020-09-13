resource "aws_dynamodb_table" "app_user_progression_videos_by_product" {
  name            = "${var.env_name}_AppUserProgressionVideosByProduct"

  read_capacity   = 2
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

  attribute {
    name  = "productID"
    type  = "S"
  }

  global_secondary_index {
    name               = "appUserID-productID-index"
    hash_key           = "appUserID"
    range_key          = "productID"
    read_capacity      = 2
    write_capacity     = 1
    projection_type    = "ALL"
  }

  tags = {
    Name          = "AppUserProgressionVideosByProduct"
    Environment   = "${var.env_name}"
  }
}