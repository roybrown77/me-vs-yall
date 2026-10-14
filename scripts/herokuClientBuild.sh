#!/usr/bin/env bash
set -euo pipefail
# Installs client devDependencies only for the compile step, then prunes them from the slug.
# Dev tools (Vite, etc.) are not bundled into src/client/dist — they are not "production JS".
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLIENT="$ROOT/src/client"
cd "$CLIENT"
if [ "${NODE_ENV:-production}" = "production" ]; then
  npm ci --include=dev
  npm run build:heroku
  npm prune --omit=dev
else
  npm ci
  npm run build:heroku
fi
