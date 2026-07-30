#!/bin/bash
set -e
cd /home/z/my-project

# Install dependencies (already done by start.sh, but just in case)
echo "[DEV] Running bun install..."
bun install --frozen-lockfile 2>/dev/null || bun install

# Push schema
if [ -f prisma/schema.prisma ]; then
  echo "[DEV] Running db:push..."
  bun run db:push
fi

# Start the dev server in FOREGROUND so the parent shell stays alive
echo "[DEV] Starting Next.js dev server on port 3000..."
exec npx next dev -p 3000
