variable "aws_region" {
  type        = string
  description = "AWS region for optional deployment."
  default     = "us-west-2"
}
variable "project_prefix" {
  type        = string
  description = "Prefix for names to avoid conflicts."
  default     = "portfolio-demo"
}
