#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"
ENV_FILE="$SCRIPT_DIR/../../.env"

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Compose file not found: $COMPOSE_FILE" >&2
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file not found: $ENV_FILE" >&2
  exit 1
fi

if [[ $# -eq 0 ]]; then
  echo "Usage: $(basename "$0") <compose-args...>"
  echo "Example: $(basename "$0") up -d --build"
  exit 1
fi

exec docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" "$@"
