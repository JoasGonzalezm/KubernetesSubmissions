#!/bin/sh
# Dumps the todo database and uploads it to Google Cloud Storage.
# Connection settings come from PGHOST, PGUSER, PGPASSWORD and PGDATABASE.
set -eu

: "${BACKUP_BUCKET:?BACKUP_BUCKET is required}"
: "${GOOGLE_APPLICATION_CREDENTIALS:?GOOGLE_APPLICATION_CREDENTIALS is required}"

FILE="todos-$(date -u +%Y-%m-%dT%H-%M-%SZ).sql.gz"

echo "Dumping database $PGDATABASE from $PGHOST"
pg_dump | gzip > "/tmp/$FILE"

gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"
gcloud storage cp "/tmp/$FILE" "gs://$BACKUP_BUCKET/$FILE"

echo "Backup saved to gs://$BACKUP_BUCKET/$FILE"
