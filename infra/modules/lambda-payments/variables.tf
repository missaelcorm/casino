variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "lambda_source_dir" {
  description = "Path to the Lambda function source directory"
  type        = string
}

variable "runtime" {
  description = "Lambda runtime"
  type        = string
  default     = "nodejs22.x"
}

variable "timeout" {
  description = "Lambda function timeout in seconds"
  type        = number
  default     = 30
}

variable "memory_size" {
  description = "Lambda function memory size in MB"
  type        = number
  default     = 256
}

variable "stripe_secret_arn" {
  description = "ARN of the Stripe secret in Secrets Manager"
  type        = string
}

variable "stripe_secret_key" {
  description = "Stripe secret key value"
  type        = string
  sensitive   = true
}

variable "frontend_base_url" {
  description = "Frontend base URL for Stripe redirects"
  type        = string
}

variable "cors_allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 14
}
