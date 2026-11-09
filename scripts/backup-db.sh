#!/bin/bash
set -euo pipefail

# PostgreSQL Backup Script for Cloudflare R2 (S3-compatible storage)
# This script dumps the PostgreSQL database and uploads it to R2
# Usage: ./backup-db.sh
#
# Environment Variables:
#   DATABASE_URL              - PostgreSQL connection string (required)
#   R2_BACKUP_BUCKET_NAME     - R2 bucket name for backups (required)
#   R2_ACCESS_KEY_ID         - R2 access key ID (required)
#   R2_SECRET_ACCESS_KEY     - R2 secret access key (required)
#   R2_ENDPOINT              - R2 endpoint URL (required)
#   BACKUP_PREFIX            - Prefix for backup filenames (default: "backup")
#   BACKUP_RETENTION_DAYS    - Days to retain backups (default: 7)

# Configuration
BACKUP_PREFIX=${BACKUP_PREFIX:-backup}
BACKUP_RETENTION_DAYS=${R2_BACKUP_RETENTION_DAYS:-7}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILENAME="${BACKUP_PREFIX}_${TIMESTAMP}.sql.gz"
BACKUP_DIR="/tmp/backups"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILENAME}"

# R2 Configuration
R2_BUCKET=${R2_BACKUP_BUCKET_NAME}
R2_ACCESS_KEY=${R2_ACCESS_KEY_ID}
R2_SECRET_KEY=${R2_SECRET_ACCESS_KEY}
R2_ENDPOINT=${R2_ENDPOINT}

# Database Configuration
DATABASE_URL=${DATABASE_URL}

# Validate required environment variables
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  exit 1
fi

if [ -z "$R2_BUCKET" ]; then
  echo "❌ ERROR: R2_BACKUP_BUCKET_NAME environment variable is not set"
  exit 1
fi

if [ -z "$R2_ACCESS_KEY" ] || [ -z "$R2_SECRET_KEY" ] || [ -z "$R2_ENDPOINT" ]; then
  echo "❌ ERROR: R2 credentials (R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT) are not set"
  exit 1
fi

echo "🗄️  Starting PostgreSQL backup..."
echo "📦 Backup prefix: $BACKUP_PREFIX"
echo "📅 Retention: $BACKUP_RETENTION_DAYS days"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Extract database connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
DB_USER=$(echo "$DATABASE_URL" | sed -n 's/\/\/\([^:]*\):.*/\1/p')
DB_PASSWORD=$(echo "$DATABASE_URL" | sed -n 's/.*:\([^@]*\)@.*/\1/p')

echo "📦 Dumping database: $DB_NAME"

# Perform database dump and compress
PGPASSWORD="$DB_PASSWORD" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --no-owner \
  --no-acl \
  --format=plain \
  | gzip > "$BACKUP_PATH"

BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
echo "✅ Backup created: $BACKUP_PATH (Size: $BACKUP_SIZE)"

# Configure AWS CLI for R2
export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_KEY"
export AWS_ENDPOINT_URL="$R2_ENDPOINT"

echo "☁️  Uploading backup to R2 bucket: $R2_BUCKET"

# Upload to R2
aws s3 cp "$BACKUP_PATH" "s3://${R2_BUCKET}/${BACKUP_FILENAME}" \
  --endpoint-url "$R2_ENDPOINT" \
  --region auto

echo "✅ Upload completed"

# Clean up old backups
echo "🧹 Cleaning up old backups (retaining last $BACKUP_RETENTION_DAYS days)..."

# List all backups in the bucket
aws s3 ls "s3://${R2_BUCKET}/" \
  --endpoint-url "$R2_ENDPOINT" \
  --region auto | grep "${BACKUP_PREFIX}_" | while read -r line; do
  BACKUP_DATE=$(echo "$line" | awk '{print $2}' | cut -d'_' -f2 | cut -d'.' -f1)
  BACKUP_FILE=$(echo "$line" | awk '{print $4}')
  
  # Calculate age of backup in days
  BACKUP_TIMESTAMP=$(date -d "${BACKUP_DATE:0:4}-${BACKUP_DATE:4:2}-${BACKUP_DATE:6:2}" +%s 2>/dev/null || echo "0")
  CURRENT_TIMESTAMP=$(date +%s)
  AGE_DAYS=$(( (CURRENT_TIMESTAMP - BACKUP_TIMESTAMP) / 86400 ))
  
  if [ "$AGE_DAYS" -gt "$BACKUP_RETENTION_DAYS" ]; then
    echo "  Deleting old backup: $BACKUP_FILE ($AGE_DAYS days old)"
    aws s3 rm "s3://${R2_BUCKET}/${BACKUP_FILE}" \
      --endpoint-url "$R2_ENDPOINT" \
      --region auto
  fi
done

# Clean up local backup file
rm -f "$BACKUP_PATH"

echo "✅ Backup process completed successfully"
echo "📊 Backup retained for: $BACKUP_RETENTION_DAYS days"
