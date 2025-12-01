output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = module.networking.private_subnet_ids
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = module.networking.public_subnet_ids
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs_cluster.cluster_name
}

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = module.alb.alb_dns_name
}

output "frontend_service_name" {
  description = "Frontend service name"
  value       = module.frontend_service.service_name
}

output "backend_service_name" {
  description = "Backend service name"
  value       = module.backend_service.service_name
}

output "cloudwatch_log_groups" {
  description = "CloudWatch log group names"
  value = {
    frontend = module.frontend_service.cloudwatch_log_group_name
    backend  = module.backend_service.cloudwatch_log_group_name
  }
}

output "monitoring_dashboard_url" {
  description = "CloudWatch dashboard URL with all metrics"
  value       = module.monitoring.dashboard_url
}

output "monitoring_dashboard_name" {
  description = "CloudWatch dashboard name"
  value       = module.monitoring.dashboard_name
}

output "sns_alerts_topic_arn" {
  description = "ARN of SNS alerts topic"
  value       = module.sns_alerts.topic_arn
}

output "critical_alarms" {
  description = "ARNs of configured critical alarms"
  value = {
    lambda_payment_errors     = module.lambda_payments.lambda_error_alarm_arn
    backend_no_healthy_hosts  = module.alb.backend_no_healthy_hosts_alarm_arn
    frontend_no_healthy_hosts = module.alb.frontend_no_healthy_hosts_alarm_arn
  }
}