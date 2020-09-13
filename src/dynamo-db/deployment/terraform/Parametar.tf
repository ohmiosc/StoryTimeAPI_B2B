resource "aws_dynamodb_table" "parameter" {
  name            = "${var.env_name}_Parametar"

  read_capacity   = 2
  write_capacity  = 1

  hash_key        = "parametarName"

  attribute {
    name  = "parametarName"
    type  = "S"
  }

  tags = {
    Name          = "Parametar"
    Environment   = "${var.env_name}"
  }
}