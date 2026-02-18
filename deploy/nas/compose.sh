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

if [[ "${NAS_FORCE_BUILDKIT:-0}" != "1" ]]; then
  # QNAP Container Station can intermittently fail while exporting BuildKit layers
  # with missing ingest directories; disable BuildKit by default for NAS deploys.
  export DOCKER_BUILDKIT=0
  export COMPOSE_DOCKER_CLI_BUILD=0
fi

OUTPUT_FILE="$(mktemp)"
cleanup() {
  rm -f "$OUTPUT_FILE"
}
trap cleanup EXIT

if docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" "$@" 2>&1 | tee "$OUTPUT_FILE"; then
  exit 0
fi

STATUS=${PIPESTATUS[0]}

if grep -Eq "failed to register layer: open .*overlay2/.*/link: no such file or directory" "$OUTPUT_FILE"; then
  cat >&2 <<'EOF'

Detected a Docker overlay2 metadata error on NAS (missing layer link file).
This is a Docker/Container Station storage issue, not an app-code issue.

Recommended recovery steps on QNAP:
  1) docker compose -f deploy/nas/docker-compose.yml --env-file .env down --remove-orphans
  2) docker builder prune -af
  3) docker system prune -af
  4) Restart Container Station (or reboot NAS)
  5) Rebuild with: bash ./deploy/nas/compose.sh up -d --build

EOF
fi

exit "$STATUS"
