#!/bin/sh
set -e

echo "=== [1/3] Instalando herramientas ==="
apk add --no-cache postgresql-client wget

echo "=== [2/3] Restaurando base de datos ==="
wget -q -O /tmp/aragon_dump.sql \
  "https://aragonteespera.com/mig_db_x7k2p9q.sql"

PGPASSWORD="$DB_PASSWORD" psql \
  -h database -U "$DB_USER" "$DB_DATABASE" \
  -v ON_ERROR_STOP=0 \
  -f /tmp/aragon_dump.sql

echo "BD restaurada OK"

echo "=== [3/3] Migrando uploads ==="
wget -q -O /tmp/uploads.tar.gz \
  "https://aragonteespera.com/mig_uploads_x7k2p9q.tar.gz"

tar -xzf /tmp/uploads.tar.gz -C /directus/uploads/
echo "Uploads migrados OK"

echo "=== MIGRACION COMPLETA ==="
