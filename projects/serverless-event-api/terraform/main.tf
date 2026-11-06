terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}
provider "aws" { region = var.aws_region }
module "order_quote_lambda" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "~> 7.0"

  function_name = "${var.project_prefix}-order-quote"
  description   = "Portfolio order quote API demo"
  handler       = "handler.lambda_handler"
  runtime       = "python3.12"
  source_path   = "../src"
  timeout       = 5
  memory_size   = 128

  create_lambda_function_url = true
  authorization_type         = "AWS_IAM"

  cloudwatch_logs_retention_in_days = 7
  tags = { Project = "serverless-event-api", ManagedBy = "Terraform" }
}
