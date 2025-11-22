output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = aws_lambda_function.payments.function_name
}

output "lambda_function_arn" {
  description = "ARN of the Lambda function"
  value       = aws_lambda_function.payments.arn
}

output "lambda_function_url" {
  description = "Function URL for the Lambda"
  value       = aws_lambda_function_url.payments.function_url
}

output "lambda_role_arn" {
  description = "ARN of the Lambda execution role"
  value       = aws_iam_role.lambda_execution_role.arn
}

output "lambda_role_name" {
  description = "Name of the Lambda execution role"
  value       = aws_iam_role.lambda_execution_role.name
}
