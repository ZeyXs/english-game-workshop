#!/bin/sh
set -e

: "${SKIP_DB_SETUP:=false}"
: "${SKIP_DB_SEED:=false}"

if [ "$SKIP_DB_SETUP" != "true" ]; then
  echo "🔧 Applying Prisma schema..."
  ./node_modules/.bin/prisma db push

  if [ "$SKIP_DB_SEED" != "true" ]; then
    echo "🌱 Seeding database..."
    ./node_modules/.bin/prisma db seed || true
  fi
else
  echo "⚠️  SKIP_DB_SETUP=true, skipping Prisma migrations and seed."
fi

exec "$@"

