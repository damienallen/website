FROM python:3.8

LABEL maintainer="Damien Allen <dev@dallen.co>"

ENV PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=1.0.2

RUN apt-get update && apt-get -y upgrade && apt-get -y install bash
RUN pip install meinheld gunicorn flask poetry==$POETRY_VERSION

# Copy only requirements, to cache them in docker layer
WORKDIR /pysetup
COPY ./poetry.lock ./pyproject.toml /pysetup/

# Initialize project and install python requirements
RUN poetry config virtualenvs.create false \
    && poetry install $(test "$FLASK_ENV" == production && echo "--no-dev") --no-interaction --no-ansi

# Copy scripts
COPY ./docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY ./docker/start.sh /start.sh
RUN chmod +x /start.sh

COPY ./docker/gunicorn_conf.py /gunicorn_conf.py

# Copy code
COPY ./app /app
WORKDIR /app/

ENV PYTHONPATH=/app
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]

# Run the start script and start Gunicorn with Meinheld
CMD ["/start.sh"]