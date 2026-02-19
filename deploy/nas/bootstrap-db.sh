#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file not found: $ENV_FILE" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "docker CLI not found. Install Docker/Container Station first." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${MARIADB_DATABASE:-}" || -z "${MARIADB_ROOT_PASSWORD:-}" || -z "${MARIADB_USER:-}" || -z "${MARIADB_PASSWORD:-}" ]]; then
  echo "Missing required env vars: MARIADB_DATABASE, MARIADB_ROOT_PASSWORD, MARIADB_USER, and/or MARIADB_PASSWORD" >&2
  exit 1
fi

sql_escape() {
  printf "%s" "$1" | sed "s/'/''/g"
}

DB_ESCAPED="$(sql_escape "$MARIADB_DATABASE")"
USER_ESCAPED="$(sql_escape "$MARIADB_USER")"
PASS_ESCAPED="$(sql_escape "$MARIADB_PASSWORD")"

echo "Ensuring MariaDB app user and grants from .env..."
docker exec -i sc-tool3-mariadb mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" <<SQL
CREATE DATABASE IF NOT EXISTS \`$MARIADB_DATABASE\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$USER_ESCAPED'@'%' IDENTIFIED BY '$PASS_ESCAPED';
ALTER USER '$USER_ESCAPED'@'%' IDENTIFIED BY '$PASS_ESCAPED';
GRANT ALL PRIVILEGES ON \`$DB_ESCAPED\`.* TO '$USER_ESCAPED'@'%';
FLUSH PRIVILEGES;
SQL

echo "Applying auth schema (MARIADB_AUTH_SCHEMA.sql)..."
docker exec -i sc-tool3-mariadb mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE" < "$ROOT_DIR/MARIADB_AUTH_SCHEMA.sql"

echo "Applying app schema + mock baseline seed (MARIADB_APP_SCHEMA.sql)..."
docker exec -i sc-tool3-mariadb mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE" < "$ROOT_DIR/MARIADB_APP_SCHEMA.sql"

echo "Bootstrap complete."
