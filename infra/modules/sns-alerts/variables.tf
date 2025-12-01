variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "alert_emails" {
  description = "List of email addresses to receive alerts (empty list for no email subscriptions)"
  type        = list(string)
  default     = []
}

variable "enable_encryption" {
  description = "Enable KMS encryption for SNS topic"
  type        = bool
  default     = false
}
