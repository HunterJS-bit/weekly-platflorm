# Dockerfile Snippet for PostgreSQL Backup Script

Add this to your Dockerfile to include the necessary dependencies for the backup script:

```dockerfile
# Add PostgreSQL client and AWS CLI for database backups
RUN apk add --no-cache postgresql-client aws-cli
```

## Complete Example

If you're using Alpine Linux (like in the weekly project):

```dockerfile
FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat postgresql-client aws-cli
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
```

## For Other Base Images

### Ubuntu/Debian:
```dockerfile
RUN apt-get update && apt-get install -y \
    postgresql-client \
    awscli \
    && rm -rf /var/lib/apt/lists/*
```

### CentOS/RHEL:
```dockerfile
RUN yum install -y postgresql awscli && yum clean all
```

## Copy Script to Image

After building your application, copy the backup script:

```dockerfile
COPY --from=builder --chown=nodejs:nodejs /app/scripts ./scripts
```

Make sure the script is executable before copying or set permissions in the Dockerfile:

```dockerfile
RUN chmod +x /app/scripts/backup-db.sh
```
