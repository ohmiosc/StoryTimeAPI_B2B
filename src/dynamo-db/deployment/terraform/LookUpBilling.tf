resource "aws_dynamodb_table" "lookup_billing" {
  name            = "${var.env_name}_LookUpBilling"

  read_capacity   = 1
  write_capacity  = 1

  hash_key        = "detectedCountry"

  attribute {
    name  = "detectedCountry"
    type  = "S"
  }

  global_secondary_index {
    name               = "detectedCountry-index"
    hash_key           = "detectedCountry"
    read_capacity      = 3
    write_capacity     = 1
    projection_type    = "ALL"
  }

  tags = {
    Name          = "LookUpBilling"
    Environment   = "${var.env_name}"
  }
}
