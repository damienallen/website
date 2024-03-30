FROM debian:12-slim AS builder
RUN apt update; apt install -y -q pipx
ENV PATH="/root/.local/bin:${PATH}"
RUN pipx install poetry
RUN pipx inject poetry poetry-plugin-bundle

WORKDIR /code
COPY ./poetry.lock ./pyproject.toml  /code/
RUN poetry install --no-interaction --no-root --no-ansi
RUN poetry bundle venv --python=/usr/bin/python3 --only=main /venv


FROM python:3.11 as development_build
LABEL maintainer="Damien Allen <dev@dallen.co>"

RUN apt update; apt install -y -q \
    curl \
    nano

ENV YOUR_ENV=${YOUR_ENV} \
    PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random

# Install node & yarn
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt install nodejs && npm install -g yarn

# Initialize project and inject python dependencies
COPY --from=builder /venv /venv
WORKDIR /code

# Copy and build in production
FROM development_build as production_build

COPY package.json yarn.lock webpack.config.js /code/
RUN yarn install

COPY ./src /code/src/
RUN yarn build

COPY ./app /code/app/
COPY ./docker /code/docker/
