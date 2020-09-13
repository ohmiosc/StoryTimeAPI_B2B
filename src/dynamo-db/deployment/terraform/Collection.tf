resource "aws_dynamodb_table" "collection" {
  name            = "${var.env_name}_Collection"

  read_capacity   = 3
  write_capacity  = 1

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }


  attribute {
    name  = "collectionId"
    type  = "S"
  }

  global_secondary_index {
    name               = "collectionId-index"
    hash_key           = "collectionId"
    read_capacity      = 3
    write_capacity     = 1
    projection_type    = "ALL"
  }


  tags = {
    Name          = "Collection"
    Environment   = "${var.env_name}"
  }
}

