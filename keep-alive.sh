#!/bin/bash
cd /home/z/my-project
while true; do
  echo "Starting dev server at $(date)" >> /home/z/my-project/keep-alive.log
  bun run dev 2>&1 | tee -a /home/z/my-project/dev.log
  echo "Server exited with code $? at $(date), restarting in 2s..." >> /home/z/my-project/keep-alive.log
  sleep 2
done
