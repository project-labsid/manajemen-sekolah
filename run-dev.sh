#!/bin/bash
cd /home/z/my-project
trap 'echo "SIGNAL $1 received at $(date)" >> /home/z/my-project/signal.log' EXIT TERM INT QUIT
exec npx next dev -p 3000 >> /home/z/my-project/dev.log 2>&1
echo "Server exited normally at $(date)" >> /home/z/my-project/signal.log
