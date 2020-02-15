FROM python:3.8 as development_build

LABEL maintainer="Damien Allen <dev@dallen.co>"

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
# FROM development_build as production_build

# COPY package.json yarn.lock webpack.config.js /code/
# RUN yarn install

# COPY ./src /code/src
# RUN yarn build
