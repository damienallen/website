FROM python:3.8 as development_build

LABEL maintainer="Damien Allen <dev@dallen.co>"

# Install node & yarn
RUN apt-get update && apt-get install -y -q curl nano
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install nodejs && npm install -g yarn

# Install Poetry
ARG POETRY_VERSION="1.0.3"
RUN pip install "poetry==$POETRY_VERSION"

# Initialize project and add python dependencies
WORKDIR /pysetup
COPY ./poetry.lock ./pyproject.toml  /pysetup/
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

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