# PostgreSQL Backup Script for Cloudflare R2

A modular, project-agnostic bash script for backing up PostgreSQL databases to Cloudflare R2 (or any S3-compatible storage).

## Features

- Automated PostgreSQL database dumps
- gzip compression for reduced storage
- Upload to Cloudflare R2 via AWS CLI
- Automatic cleanup of old backups based on retention policy
- Configurable backup prefix for multiple projects
- Works with any S3-compatible storage (R2, MinIO, Wasabi, etc.)

## Requirements

- `pg_dump` (PostgreSQL client)
- `aws-cli` (AWS Command Line Interface)
- Bash shell

## Installation

### 1. Copy the Script

Copy `backup-db.sh` to your project's scripts directory:

```bash
mkdir -p scripts
cp backup-db.sh scripts/
chmod +x scripts/backup-db.sh
```

### 2. Add Docker Dependencies

Add PostgreSQL client and AWS CLI to your Dockerfile. See [BACKUP_DOCKERFILE.md](./BACKUP_DOCKERFILE.md) for examples.

### 3. Configure Environment Variables

Set the following environment variables in your deployment platform:

**Required:**
- `DATABASE_URL` - PostgreSQL connection string (e.g., `postgresql://user:password@host:5432/database`)
- `R2_BACKUP_BUCKET_NAME` - R2 bucket name for backups
- `R2_ACCESS_KEY_ID` - R2 access key ID
- `R2_SECRET_ACCESS_KEY` - R2 secret access key
- `R2_ENDPOINT` - R2 endpoint URL (e.g., `https://<accountid>.r2.cloudflarestorage.com`)

**Optional:**
- `BACKUP_PREFIX` - Prefix for backup filenames (default: `backup`)
- `R2_BACKUP_RETENTION_DAYS` - Days to retain backups (default: `7`)

### 4. Set Up Cron Job

Configure a cron job in your deployment platform (Dokploy, Kubernetes, etc.):

```yaml
schedule: "0 2 * * 0"  # Weekly on Sunday at 2:00 AM UTC
command: "/app/scripts/backup-db.sh"
```

## Usage

### Manual Execution

```bash
# Set environment variables
export DATABASE_URL="postgresql://user:password@host:5432/database"
export R2_BACKUP_BUCKET_NAME="my-backups"
export R2_ACCESS_KEY_ID="your_key"
export R2_SECRET_ACCESS_KEY="your_secret"
export R2_ENDPOINT="https://your-endpoint.r2.cloudflarestorage.com"

# Run the script
./scripts/backup-db.sh
```

### With Custom Prefix

```bash
export BACKUP_PREFIX="myproject"
./scripts/backup-db.sh
# Creates: myproject_20241109_020000.sql.gz
```

### With Custom Retention

```bash
export R2_BACKUP_RETENTION_DAYS=30
./scripts/backup-db.sh
# Retains backups for 30 days
```

## Backup Filename Format

Backups are named using the pattern: `{PREFIX}_{TIMESTAMP}.sql.gz`

Example: `backup_20241109_020000.sql.gz`

## Multiple Projects

Use different `BACKUP_PREFIX` values for different projects sharing the same R2 bucket:

```bash
# Project A
export BACKUP_PREFIX="project-a"
export R2_BACKUP_BUCKET_NAME="shared-backups"

# Project B
export BACKUP_PREFIX="project-b"
export R2_BACKUP_BUCKET_NAME="shared-backups"
```

The cleanup script only deletes backups matching the current `BACKUP_PREFIX`, so projects won't interfere with each other.

## Restoring from Backup

To restore a backup from R2:

```bash
# Download the backup
aws s3 cp s3://my-backups/backup_20241109_020000.sql.gz /tmp/backup.sql.gz \
  --endpoint-url "$R2_ENDPOINT"

# Decompress
gunzip /tmp/backup.sql.gz

# Restore
psql -h host -U user -d database < /tmp/backup.sql
```

## Troubleshooting

### "pg_dump: command not found"
Install PostgreSQL client in your Dockerfile (see [BACKUP_DOCKERFILE.md](./BACKUP_DOCKERFILE.md))

### "aws: command not found"
Install AWS CLI in your Dockerfile (see [BACKUP_DOCKERFILE.md](./BACKUP_DOCKERFILE.md))

### "Access Denied"
Verify your R2 credentials and bucket permissions. Ensure the access key has write access to the bucket.

### Backup not appearing in R2
Check the script output for errors. Verify `R2_ENDPOINT` is correct and accessible from your deployment environment.

## License

MIT License - Feel free to use in any project.
