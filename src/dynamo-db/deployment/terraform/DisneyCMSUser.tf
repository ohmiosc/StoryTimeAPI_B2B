resource "aws_dynamodb_table" "disney_cms_user" {
  name            = "${var.env_name}_DisneyCMSUser"

  read_capacity   = 1
  write_capacity  = 1

  hash_key        = "id"

  attribute {
    name  = "id"
    type  = "S"
  }

  tags = {
    Name          = "DisneyCMSUser"
    Environment   = "${var.env_name}"
  }
}