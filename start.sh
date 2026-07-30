#!/bin/bash
cd /home/z/my-project
rm -rf .next
exec bun run dev > /dev/null 2>&1
