resource "aws_dynamodb_table" "lookup_product_and_site" {
  name            = "${var.env_name}_LookUpProductAndSite"

  read_capacity   = 1
  write_capacity  = 1

  hash_key        = "productID"
  range_key = "lookUpType"

  attribute {
    name  = "productID"
    type  = "S"
  }

  attribute {
    name  = "lookUpType"
    type  = "N"
  }

  tags = {
    Name          = "LookUpProductAndSite"
    Environment   = "${var.env_name}"
  }
}
