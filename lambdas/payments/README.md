# Payments Lambda

Stripe payment processing Lambda function for Frío Casino.

## Building

To build the Lambda deployment package:

```bash
npm run build
```

This will create `lambda-payments.zip` with all dependencies bundled.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

## Environment Variables

- `STRIPE_SECRET_KEY` - Stripe API secret key (from AWS Secrets Manager)
- `FRONTEND_BASE_URL` - Frontend base URL for Stripe redirects

## Deployment

The Lambda is deployed via Terraform. The pre-built zip package is referenced in the Terraform configuration.
