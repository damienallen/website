FROM python:3.11 as development_build

LABEL maintainer="Damien Allen <dev@dallen.co>"

# Install node & yarn
RUN apt-get update && apt-get install -y -q curl nano
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install nodejs && npm install -g yarn

# Install Poetry
RUN pip install poetry==1.3.2

# Initialize project and add python dependencies
WORKDIR /code
COPY ./poetry.lock ./pyproject.toml  /code/
RUN poetry install --no-interaction --no-ansi

# Copy and build in production
FROM development_build as production_build

COPY package.json yarn.lock webpack.config.js /code/
RUN yarn install

COPY ./src /code/src/
RUN yarn build

COPY ./app /code/app/
COPY ./docker /code/docker/
