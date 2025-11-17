#!/bin/bash

# Wait for LocalStack to be ready
echo "Waiting for LocalStack to be ready..."
until aws --endpoint-url=http://localhost:4566 s3 ls > /dev/null 2>&1; do
  sleep 1
done

echo "LocalStack is ready. Creating S3 bucket..."

# Create the bucket
aws --endpoint-url=http://localhost:4566 \
    s3 mb s3://local-friocasino

# Block all public access to the bucket
aws --endpoint-url=http://localhost:4566 \
    s3api put-public-access-block \
    --bucket local-friocasino \
    --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

echo "S3 bucket 'local-friocasino' created with private access configuration"
