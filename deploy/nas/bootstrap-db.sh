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

if [[ -z "${MARIADB_DATABASE:-}" || -z "${MARIADB_ROOT_PASSWORD:-}" ]]; then
  echo "Missing required env vars: MARIADB_DATABASE and/or MARIADB_ROOT_PASSWORD" >&2
  exit 1
fi

echo "Applying auth schema (MARIADB_AUTH_SCHEMA.sql)..."
docker exec -i sc-tool3-mariadb mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE" < "$ROOT_DIR/MARIADB_AUTH_SCHEMA.sql"

echo "Applying app schema + mock baseline seed (MARIADB_APP_SCHEMA.sql)..."
docker exec -i sc-tool3-mariadb mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE" < "$ROOT_DIR/MARIADB_APP_SCHEMA.sql"

echo "Bootstrap complete."
