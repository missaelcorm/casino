output "alb_id" {
  description = "ID of the ALB"
  value       = aws_lb.main.id
}

output "alb_arn" {
  description = "ARN of the ALB"
  value       = aws_lb.main.arn
}

output "alb_dns_name" {
  description = "DNS name of the ALB"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the ALB"
  value       = aws_lb.main.zone_id
}

output "https_listener_arn" {
  description = "ARN of the HTTPS listener"
  value       = aws_lb_listener.https.arn
}

output "frontend_target_group_arn" {
  description = "ARN of the frontend target group"
  value       = aws_lb_target_group.frontend.arn
}

output "backend_target_group_arn" {
  description = "ARN of the backend target group"
  value       = aws_lb_target_group.backend.arn
}

output "logs_bucket_name" {
  description = "Name of the S3 bucket for ALB logs"
  value       = aws_s3_bucket.alb_logs.id
}

output "alb_5xx_alarm_arn" {
  description = "ARN of the ALB 5XX error alarm"
  value       = aws_cloudwatch_metric_alarm.alb_5xx.arn
}

output "alb_4xx_alarm_arn" {
  description = "ARN of the ALB 4XX error alarm"
  value       = aws_cloudwatch_metric_alarm.alb_4xx.arn
}

output "alb_arn_suffix" {
  description = "ARN suffix of the ALB (for CloudWatch metrics)"
  value       = aws_lb.main.arn_suffix
}

output "frontend_target_group_arn_suffix" {
  description = "ARN suffix of the frontend target group (for CloudWatch metrics)"
  value       = aws_lb_target_group.frontend.arn_suffix
}

output "backend_target_group_arn_suffix" {
  description = "ARN suffix of the backend target group (for CloudWatch metrics)"
  value       = aws_lb_target_group.backend.arn_suffix
}

output "backend_no_healthy_hosts_alarm_arn" {
  description = "ARN of backend no healthy hosts alarm (if enabled)"
  value       = var.enable_healthy_host_alarms ? aws_cloudwatch_metric_alarm.backend_no_healthy_hosts[0].arn : null
}

output "frontend_no_healthy_hosts_alarm_arn" {
  description = "ARN of frontend no healthy hosts alarm (if enabled)"
  value       = var.enable_healthy_host_alarms ? aws_cloudwatch_metric_alarm.frontend_no_healthy_hosts[0].arn : null
}