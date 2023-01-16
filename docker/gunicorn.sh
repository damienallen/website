#!/usr/bin/env sh

set -o errexit
set -o nounset

# Start gunicorn with workers:
if [ "$FLASK_DEBUG" = "1" ]
then
  echo 'Running in development mode...'
  /usr/local/bin/gunicorn main:app --reload \
    --workers 2 \
    --bind 0.0.0.0:8080 \
    --chdir=/code/app \
    --log-file=- \
    --worker-tmp-dir /dev/shm
else
  echo 'Copying static assets...'
  rm -rf /dist/*
  cp -r /code/dist/* /dist/
  /usr/local/bin/gunicorn main:app \
    --workers 4 \
    --bind 0.0.0.0:8080 \
    --chdir=/code/app \
    --log-file=- \
    --worker-tmp-dir /dev/shm
fi
