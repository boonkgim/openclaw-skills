#!/bin/bash
# serve.sh — Start browser-sync for a presentation directory
# Usage: serve.sh <presentation-dir>

set -e

DIR="${1:?Usage: serve.sh <presentation-dir>}"

# Find available port
PORT=3000
while lsof -i :"$PORT" >/dev/null 2>&1; do PORT=$((PORT+1)); done

# Start browser-sync
cd "${DIR}"
npx browser-sync start --server --files "index.html, slides/*.html" --no-notify --no-open --port "$PORT" &
BS_PID=$!

# Wait for server to be ready
sleep 2

# Verify actual port
ACTUAL_PORT=$(lsof -p "$BS_PID" -iTCP -sTCP:LISTEN -P 2>/dev/null | grep -oE ':[0-9]+' | head -1 | tr -d ':')
ACTUAL_PORT="${ACTUAL_PORT:-$PORT}"

echo "SERVER_PID=${BS_PID}"
echo "SERVER_URL=http://localhost:${ACTUAL_PORT}"
