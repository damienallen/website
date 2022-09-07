FROM python:3.8 as development_build

LABEL maintainer="Damien Allen <dev@dallen.co>"

# Install node & yarn
RUN apt-get update && apt-get install -y -q curl nano
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install nodejs && npm install -g yarn

# Install Poetry
ARG GET_POETRY_IGNORE_DEPRECATION=1
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

# Initialize project and add python dependencies
WORKDIR /pysetup
COPY ./poetry.lock ./pyproject.toml  /pysetup/
RUN poetry install --no-interaction --no-ansi

# Use mounted code in development
WORKDIR /code

# Copy and build in production
FROM development_build as production_build

COPY package.json yarn.lock webpack.config.js /code/
RUN yarn install

COPY ./src /code/src/
RUN yarn build

COPY ./app /code/app/
COPY ./docker /code/docker/
