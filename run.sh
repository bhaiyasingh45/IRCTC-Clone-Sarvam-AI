#!/usr/bin/env bash
# Starts the Sarvam API proxy and the dev server. Frees both ports first if something is using them.
# Usage: ./run.sh [port]   (default 5173, or $PORT; proxy uses $API_PORT, default 8787)

set -euo pipefail

cd "$(dirname "$0")"

PORT="${1:-${PORT:-5173}}"
API_PORT="${API_PORT:-8787}"
export API_PORT

# Kill whatever is listening on a port
free_port() {
  local PIDS
  PIDS="$(lsof -ti tcp:"$1" -sTCP:LISTEN 2>/dev/null || true)"
  if [ -n "$PIDS" ]; then
    echo "Port $1 is in use (PID: $(echo $PIDS | tr '\n' ' ')) - killing it..."
    echo "$PIDS" | xargs kill -9
    sleep 1
  fi
}
free_port "$PORT"
free_port "$API_PORT"

# Install dependencies if missing
if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

if [ ! -f .env ]; then
  echo "Warning: .env not found - copy .env.example to .env and set SARVAM_API_KEY."
fi

# Proxy in the background; stopped when this script exits
node server/index.js &
PROXY_PID=$!
trap 'kill "$PROXY_PID" 2>/dev/null || true' EXIT INT TERM

echo "Starting app on http://localhost:$PORT"
npm run dev -- --port "$PORT" --strictPort
