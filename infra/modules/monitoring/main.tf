locals {
  name_prefix = "${var.project}-${var.environment}"
}

# CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${local.name_prefix}-metrics"

  dashboard_body = jsonencode({
    widgets = [
      # 1. Application Latency
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "TargetResponseTime", {
              stat    = "Average"
              label   = "Average Latency"
              color   = "#2ca02c"
              period  = 60
              yAxis   = "left"
            }],
            ["...", {
              stat    = "p99"
              label   = "P99 Latency"
              color   = "#d62728"
              period  = 60
              yAxis   = "left"
            }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "1. Response Latency (ALB)"
          period  = 300
          yAxis = {
            left = {
              label = "Seconds"
            }
          }
        }
        width  = 12
        height = 6
        x      = 0
        y      = 0
      },

      # 2. Traffic Volume
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", {
              stat   = "Sum"
              label  = "Total Requests"
              period = 60
            }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "2. Traffic Volume (Requests/min)"
          period  = 300
          yAxis = {
            left = {
              label = "Requests"
            }
          }
        }
        width  = 12
        height = 6
        x      = 12
        y      = 0
      },

      # 3. Error Rate
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "HTTPCode_Target_5XX_Count", {
              stat   = "Sum"
              label  = "5xx Errors (Backend)"
              color  = "#d62728"
              period = 60
            }],
            [".", "HTTPCode_Target_4XX_Count", {
              stat   = "Sum"
              label  = "4xx Errors (Client)"
              color  = "#ff7f0e"
              period = 60
            }],
            [".", "HTTPCode_ELB_5XX_Count", {
              stat   = "Sum"
              label  = "5xx Errors (ALB)"
              color  = "#9467bd"
              period = 60
            }]
          ]
          view    = "timeSeries"
          stacked = true
          region  = var.aws_region
          title   = "3. HTTP Error Rate"
          period  = 300
          yAxis = {
            left = {
              label = "Errors"
            }
          }
        }
        width  = 12
        height = 6
        x      = 0
        y      = 6
      },

      # 4. CPU and Memory Usage (Container Insights)
      {
        type = "metric"
        properties = {
          metrics = [
            ["ECS/ContainerInsights", "CpuUtilized", "ClusterName", var.ecs_cluster_name, {
              stat  = "Average"
              label = "CPU Utilized"
              color = "#1f77b4"
            }],
            [".", "MemoryUtilized", {
              stat  = "Average"
              label = "Memory Utilized"
              color = "#ff7f0e"
              yAxis = "right"
            }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "4. Resource Usage (ECS Container Insights)"
          period  = 300
          yAxis = {
            left = {
              label = "CPU (vCPU)"
            }
            right = {
              label = "Memory (MB)"
            }
          }
        }
        width  = 12
        height = 6
        x      = 12
        y      = 6
      },

      # 5. Lambda Performance (Payments)
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/Lambda", "Duration", "FunctionName", var.lambda_function_name, {
              stat  = "Average"
              label = "Average Duration"
              color = "#2ca02c"
            }],
            [".", "Errors", ".", ".", {
              stat  = "Sum"
              label = "Errors"
              color = "#d62728"
              yAxis = "right"
            }],
            [".", "Invocations", ".", ".", {
              stat  = "Sum"
              label = "Invocations"
              color = "#1f77b4"
              yAxis = "right"
            }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "5. Payment Lambda - Performance"
          period  = 300
          yAxis = {
            left = {
              label = "Duration (ms)"
            }
            right = {
              label = "Count"
            }
          }
        }
        width  = 12
        height = 6
        x      = 0
        y      = 12
      },

      # BONUS: Target Groups Health Status
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "HealthyHostCount", "TargetGroup", var.backend_target_group_arn_suffix, "LoadBalancer", var.alb_arn_suffix, {
              stat  = "Average"
              label = "Backend Healthy"
              color = "#2ca02c"
            }],
            [".", "UnHealthyHostCount", ".", ".", ".", ".", {
              stat  = "Average"
              label = "Backend Unhealthy"
              color = "#d62728"
            }],
            [".", "HealthyHostCount", ".", var.frontend_target_group_arn_suffix, ".", ".", {
              stat  = "Average"
              label = "Frontend Healthy"
              color = "#17becf"
            }],
            [".", "UnHealthyHostCount", ".", ".", ".", ".", {
              stat  = "Average"
              label = "Frontend Unhealthy"
              color = "#ff7f0e"
            }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "BONUS: Services Health Status"
          period  = 300
          yAxis = {
            left = {
              label = "Hosts"
            }
          }
        }
        width  = 12
        height = 6
        x      = 12
        y      = 12
      },

      # BONUS: DocumentDB Connections
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/DocDB", "DatabaseConnections", "DBClusterIdentifier", var.documentdb_cluster_id, {
              stat  = "Average"
              label = "Active Connections"
              color = "#1f77b4"
            }],
            [".", "CPUUtilization", ".", ".", {
              stat  = "Average"
              label = "CPU Utilized"
              color = "#ff7f0e"
              yAxis = "right"
            }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "BONUS: DocumentDB - Connections and CPU"
          period  = 300
          yAxis = {
            left = {
              label = "Connections"
            }
            right = {
              label = "CPU %"
            }
          }
        }
        width  = 12
        height = 6
        x      = 0
        y      = 18
      },

      # BONUS: ECS Logs Query Results
      {
        type = "log"
        properties = {
          query   = <<-EOT
            SOURCE '/ecs/${local.name_prefix}-cluster'
            | fields @timestamp, @message
            | filter @message like /ERROR/
            | stats count() by bin(5m)
          EOT
          region  = var.aws_region
          title   = "BONUS: Errors in ECS Logs (last 3h)"
        }
        width  = 12
        height = 6
        x      = 12
        y      = 18
      }
    ]
  })

  depends_on = [
    # Ensure resources exist before creating the dashboard
  ]
}
