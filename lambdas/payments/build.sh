#!/bin/bash

# Build script for Lambda deployment package
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${SCRIPT_DIR}/dist"
PACKAGE_NAME="lambda-payments.zip"
HASHES_FILE="hashes.txt"

echo "Building Lambda deployment package..."

# Clean previous build
rm -rf "${OUTPUT_DIR}"
mkdir -p "${OUTPUT_DIR}"

# Generate Hashes
echo "Generating hashes..."
SOURCE_CODE_SHA256=$(sha256sum ${SCRIPT_DIR}/lambda.js | awk '{print $1}')
PACKAGE_JSON_SHA256=$(sha256sum ${SCRIPT_DIR}/package.json | awk '{print $1}')
PACKAGE_LOCK_JSON_SHA256=$(sha256sum ${SCRIPT_DIR}/package-lock.json | awk '{print $1}')

echo "SHA256: ${SCRIPT_DIR}/lambda.js"
echo $SOURCE_CODE_SHA256 | tee -a "${OUTPUT_DIR}/${HASHES_FILE}"
echo "SHA256: ${SCRIPT_DIR}/package.json"
echo $PACKAGE_JSON_SHA256 | tee -a "${OUTPUT_DIR}/${HASHES_FILE}"
echo "SHA256: ${SCRIPT_DIR}/package-lock.json"
echo $PACKAGE_LOCK_JSON_SHA256 | tee -a "${OUTPUT_DIR}/${HASHES_FILE}"

# Install production dependencies
echo "Installing production dependencies..."
npm ci --production --prefix "${SCRIPT_DIR}"

# Copy Lambda code
echo "Copying Lambda code..."
cp "${SCRIPT_DIR}/lambda.js" "${OUTPUT_DIR}/"

# Copy node_modules
echo "Copying dependencies..."
cp -r "${SCRIPT_DIR}/node_modules" "${OUTPUT_DIR}/"

# Create zip package
echo "Creating zip package..."
cd "${OUTPUT_DIR}"
zip -r "${PACKAGE_NAME}" . -x "*.git*" "*.DS_Store"

# Move to final location
mv "${PACKAGE_NAME}" "${SCRIPT_DIR}/${PACKAGE_NAME}"

echo "Lambda package created: ${SCRIPT_DIR}/${PACKAGE_NAME}"

# Clean up
cd "${SCRIPT_DIR}"
rm -rf "${OUTPUT_DIR}"

echo "Build complete!"
