resource "aws_dynamodb_table" "app_user" {
  name            = "${var.env_name}_AppUser"

  read_capacity   = 3
  write_capacity  = 1

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  attribute {
    name  = "productID"
    type  = "S"
  }

  attribute {
    name  = "deviceID"
    type  = "S"
  }

  attribute {
    name  = "msisdn"
    type  = "S"
  }

  attribute {
    name  = "email"
    type  = "S"
  }

  global_secondary_index {
    name               = "productID-index"
    hash_key           = "productID"
    read_capacity      = 3
    write_capacity     = 1
    projection_type    = "ALL"
  }

  global_secondary_index {
    name               = "deviceID-index"
    hash_key           = "deviceID"
    read_capacity      = 3
    write_capacity     = 1
    projection_type    = "ALL"
  }

  global_secondary_index {
    name               = "MSISDN-index"
    hash_key           = "msisdn"
    read_capacity      = 3
    write_capacity     = 1
    projection_type    = "ALL"
  }

  global_secondary_index {
    name               = "email-index"
    hash_key           = "email"
    read_capacity      = 3
    write_capacity     = 1
    projection_type    = "ALL"
  }

  tags = {
    Name          = "AppUser"
    Environment   = "${var.env_name}"
  }
}
