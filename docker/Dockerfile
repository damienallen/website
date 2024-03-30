FROM python:3.11 as development_build

LABEL maintainer="Damien Allen <dev@dallen.co>"

RUN apt update; apt install -y -q \
    curl \
    nano \
    pipx

# Install Poetry
ENV YOUR_ENV=${YOUR_ENV} \
    PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    # Poetry's configuration:
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_CACHE_DIR='/var/cache/pypoetry' \
    POETRY_HOME='/usr/local'

RUN pipx install poetry==1.7.1; pipx ensurepath

# Install node & yarn
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install nodejs && npm install -g yarn

# Initialize project and add python dependencies
WORKDIR /code
COPY ./poetry.lock ./pyproject.toml  /code/
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi

# Copy and build in production
FROM development_build as production_build

COPY package.json yarn.lock webpack.config.js /code/
RUN yarn install

COPY ./src /code/src/
RUN yarn build

COPY ./app /code/app/
COPY ./docker /code/docker/
