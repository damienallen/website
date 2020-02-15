#!/usr/bin/env sh

set -o errexit
set -o nounset

# Start gunicorn with 4 workers:
/usr/local/bin/gunicorn main:app \
  --workers 4 \
  --bind 0.0.0.0:8080 \
  --chdir=/code/app \
  --log-file=- \
  --worker-tmp-dir /dev/shm
