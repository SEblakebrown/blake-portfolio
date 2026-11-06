output "function_name" { value = module.order_quote_lambda.lambda_function_name }
output "function_url" {
  value       = module.order_quote_lambda.lambda_function_url
  description = "IAM-protected endpoint. Sign requests with SigV4."
}
