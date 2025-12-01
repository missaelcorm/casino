variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "lambda_function_name" {
  description = "Payment Lambda function name"
  type        = string
}

variable "alb_arn_suffix" {
  description = "ARN suffix of the Application Load Balancer"
  type        = string
}

variable "backend_target_group_arn_suffix" {
  description = "ARN suffix of the backend target group"
  type        = string
}

variable "frontend_target_group_arn_suffix" {
  description = "ARN suffix of the frontend target group"
  type        = string
}

variable "documentdb_cluster_id" {
  description = "DocumentDB cluster identifier"
  type        = string
}
