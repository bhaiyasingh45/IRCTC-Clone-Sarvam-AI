#!/usr/bin/env bash
# Starts the dev server. Frees the port first if something is already using it.
# Usage: ./run.sh [port]   (default 5173, or $PORT)

set -euo pipefail

cd "$(dirname "$0")"

PORT="${1:-${PORT:-5173}}"

# Kill whatever is listening on the port
PIDS="$(lsof -ti tcp:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
if [ -n "$PIDS" ]; then
  echo "Port $PORT is in use (PID: $(echo $PIDS | tr '\n' ' ')) - killing it..."
  echo "$PIDS" | xargs kill -9
  sleep 1
fi

# Install dependencies if missing
if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

if [ ! -f .env ]; then
  echo "Warning: .env not found - Sarvam API calls will fail until you create it."
fi

echo "Starting app on http://localhost:$PORT"
exec npm run dev -- --port "$PORT" --strictPort
