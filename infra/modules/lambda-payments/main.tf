locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project
    ManagedBy   = "Terraform"
  }
}

# IAM Role for Lambda execution
resource "aws_iam_role" "lambda_execution_role" {
  name = "${var.project}-${var.environment}-payments-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

# Attach basic Lambda execution policy
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# IAM Policy for accessing Stripe Secret Key from Secrets Manager
resource "aws_iam_policy" "lambda_secrets_policy" {
  name        = "${var.project}-${var.environment}-payments-lambda-secrets-policy"
  description = "Allow Lambda to read Stripe secret from Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = var.stripe_secret_arn
      }
    ]
  })

  tags = local.common_tags
}

# Attach Secrets Manager policy to Lambda role
resource "aws_iam_role_policy_attachment" "lambda_secrets_attachment" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_secrets_policy.arn
}

# Lambda Function
resource "aws_lambda_function" "payments" {
  filename         = var.lambda_package_path
  function_name    = "${var.project}-${var.environment}-payments"
  role             = aws_iam_role.lambda_execution_role.arn
  handler          = "lambda.handler"
  source_code_hash = try(filebase64sha256(var.lambda_hashes_path), null)
  runtime          = var.runtime
  timeout          = var.timeout
  memory_size      = var.memory_size

  environment {
    variables = {
      STRIPE_SECRET_KEY   = var.stripe_secret_key
      FRONTEND_BASE_URL   = var.frontend_base_url
    }
  }

  tags = local.common_tags
}

# Lambda Function URL (for HTTP access with CORS)
resource "aws_lambda_function_url" "payments" {
  function_name      = aws_lambda_function.payments.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = var.cors_allowed_origins
    allow_methods     = ["*"]
    allow_headers     = ["*"]
    expose_headers    = ["*"]
    max_age          = 86400
  }
}

# CloudWatch Log Group for Lambda
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.payments.function_name}"
  retention_in_days = var.log_retention_days

  tags = local.common_tags
}

# CloudWatch Alarm: Payment Lambda Errors (CRITICAL)
resource "aws_cloudwatch_metric_alarm" "lambda_payment_errors" {
  count               = var.enable_error_alarm ? 1 : 0
  alarm_name          = "${var.project}-${var.environment}-lambda-payment-errors-critical"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300 # 5 minutes
  statistic           = "Sum"
  threshold           = 3
  alarm_description   = "CRITICAL: Payment Lambda has 3+ errors in 5 minutes. Check logs and Stripe integration immediately."
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = aws_lambda_function.payments.function_name
  }

  alarm_actions = var.alarm_sns_topic_arn != "" ? [var.alarm_sns_topic_arn] : []
  ok_actions    = var.alarm_sns_topic_arn != "" ? [var.alarm_sns_topic_arn] : []

  tags = merge(
    local.common_tags,
    {
      Severity = "Critical"
      Category = "Payments"
    }
  )
}
