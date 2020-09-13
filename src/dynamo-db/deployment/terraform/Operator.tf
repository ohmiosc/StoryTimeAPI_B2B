resource "aws_dynamodb_table" "operator" {
  name            = "${var.env_name}_Operator"

  read_capacity   = 5
  write_capacity  = 5

  hash_key = "operatorName"

  attribute {
    name  = "operatorName"
    type  = "S"
  }

  tags = {
    Name          = "Operator"
    Environment   = "${var.env_name}"
  }
}
