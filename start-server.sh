#!/bin/bash
cd /home/z/my-project
LOG=/home/z/my-project/server-debug.log

while true; do
  echo "[$(date)] Starting server" >> $LOG
  HOSTNAME=0.0.0.0 PORT=3000 NODE_ENV=production node .next/standalone/server.js >> $LOG 2>&1
  EC=$?
  echo "[$(date)] Exited code=$EC" >> $LOG
  # Kill any lingering processes on port 3000
  fuser -k 3000/tcp 2>/dev/null
  sleep 2
done