# SNS Alerts Module

Terraform module to create an SNS topic for CloudWatch alarms.

## Usage

```hcl
module "sns_alerts" {
  source = "../../modules/sns-alerts"

  project      = "friocasino"
  environment  = "dev"
  alert_emails = [
    "admin@example.com",
    "ops-team@example.com",
    "devops@example.com"
  ]
}
```

## Variables

| Variable | Description | Type | Default | Required |
|----------|-------------|------|---------|----------|
| `project` | Project name | string | - | Yes |
| `environment` | Environment (dev, staging, prod) | string | - | Yes |
| `alert_emails` | List of email addresses to receive alerts | list(string) | [] | No |
| `enable_encryption` | Enable KMS encryption for SNS topic | bool | false | No |

## Outputs

| Output | Description |
|--------|-------------|
| `topic_arn` | ARN of the SNS topic |
| `topic_name` | Name of the SNS topic |
| `topic_id` | ID of the SNS topic |

## Resources Created

- `aws_sns_topic.alerts` - SNS topic for alerts
- `aws_sns_topic_subscription.email_alerts` - Email subscriptions (one per email address)
- `aws_sns_topic_policy.alerts` - Policy to allow CloudWatch to publish

## Notes

- Each email address in `alert_emails` will receive a confirmation email from AWS SNS
- You must click the confirmation link in each email to activate notifications
- The topic can be used by multiple CloudWatch alarms
- Leave `alert_emails` empty (`[]`) to create the topic without email subscriptions

## Example: Multiple Email Recipients

```hcl
module "sns_alerts" {
  source = "../../modules/sns-alerts"

  project      = "friocasino"
  environment  = "prod"

  alert_emails = [
    "oncall-primary@example.com",
    "oncall-secondary@example.com",
    "team-lead@example.com"
  ]

  enable_encryption = true
}
```
