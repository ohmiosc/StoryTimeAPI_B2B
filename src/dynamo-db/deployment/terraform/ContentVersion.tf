resource "aws_dynamodb_table" "content_version" {
  name            = "${var.env_name}_ContentVersion"

  read_capacity   = 2
  write_capacity  = 2

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  attribute {
    name  = "version_id"
    type  = "S"
  }


  global_secondary_index {
    name               = "version_id-index"
    hash_key           = "version_id"
    read_capacity      = 3
    write_capacity     = 3
    projection_type    = "ALL"
  }


  tags = {
    Name          = "ContentVersion"
    Environment   = "${var.env_name}"
  }
}
