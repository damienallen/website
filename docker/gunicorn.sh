#!/usr/bin/env sh

set -o errexit
set -o nounset

if [ "$FLASK_ENV" = "deploy" ]
then
  echo 'Copying static assets...'
  rm -rf /dist/*
  cp -r /code/dist/* /dist/
fi

# Start gunicorn with workers:
/usr/local/bin/gunicorn main:app \
  --workers 2 \
  --bind 0.0.0.0:8080 \
  --chdir=/code/app \
  --log-file=- \
  --worker-tmp-dir /dev/shm
