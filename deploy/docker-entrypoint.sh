#!/bin/sh
set -e
mkdir -p /app/data
chown node:node /app/data
exec runuser -u node -- "$@"
