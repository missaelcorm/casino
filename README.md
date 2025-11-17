# Friocasino

## Local Development Setup
### Setup files

MongoDB username and password:
```bash
echo "root" > .db_root_username
echo "superpassword" > .db_root_password
```

Localstack directory (For S3)
```bash
mkdir localstack
```

Backend `.env` file and fill the variables:
```bash
cp backend/.env.example .env
```

> Make sure DB connection matches with username/password setup for MongoDB


### Start services
```bash
docker compose up -d
```

### Set Up Localstack's S3 Interaction

```bash
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_ENDPOINT_URL_S3=http://localhost:4566
export AWS_REGION=us-east-1
```

Create bucket
```bash
aws s3 mb s3://friocasino-test
```

List bucket
```bash
aws s3 ls
```

List bucket's content
```bash
aws s3 ls s3://friocasino-test
```