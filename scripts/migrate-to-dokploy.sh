#!/bin/sh
set -e

echo "=== [1/3] Instalando herramientas ==="
apk add --no-cache sshpass openssh-client postgresql-client rsync

echo "=== [2/3] Migrando base de datos ==="
sshpass -p "$PLESK_PASS" ssh \
  -o StrictHostKeyChecking=no \
  -o UserKnownHostsFile=/dev/null \
  -o LogLevel=ERROR \
  "$PLESK_USER@$PLESK_HOST" \
  "PGPASSWORD='$PLESK_DB_PASS' pg_dump \
    -h 127.0.0.1 -U $PLESK_DB_USER \
    --clean --if-exists --encoding=UTF8 \
    --no-owner --no-privileges \
    $PLESK_DB_NAME" | \
  PGPASSWORD="$DB_PASSWORD" psql \
    -h database -U "$DB_USER" "$DB_DATABASE" \
    -v ON_ERROR_STOP=0

echo "=== [3/3] Migrando uploads ==="
sshpass -p "$PLESK_PASS" scp \
  -o StrictHostKeyChecking=no \
  -o UserKnownHostsFile=/dev/null \
  -o LogLevel=ERROR \
  -r \
  "$PLESK_USER@$PLESK_HOST:/var/www/vhosts/aragonteespera.com/directus/uploads/." \
  /directus/uploads/

echo "=== MIGRACION COMPLETA ==="
