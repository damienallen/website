FROM alpine:3.11 as development_build

LABEL maintainer="Damien Allen <dev@dallen.co>"

ARG VERSION="1.0.4"

RUN apk update && apk upgrade \
    && apk add --no-cache bash git nodejs npm openssh-client yarn \
    && apk add --no-cache --virtual .build-dependencies tar curl

RUN curl --silent --show-error --fail --location \
    --header "Accept: application/tar+gzip, application/x-gzip, application/octet-stream" -o - \
    "https://github.com/caddyserver/caddy/releases/download/v${VERSION}/caddy_v${VERSION}_linux_amd64.tar.gz" \
    | tar --no-same-owner -C /usr/bin -xz \
    && chmod 0755 /usr/bin/caddy \
    && /usr/bin/caddy -version \
    && apk del .build-dependencies

EXPOSE 80 443 2020
VOLUME /root/.caddy

CMD ["/usr/bin/caddy", "--conf", "/etc/Caddyfile", "--log", "stdout"]

# Use mounted code in development
WORKDIR /code

# Copy and build in production
FROM development_build as production_build

COPY docker/caddy/Caddyfile /etc/Caddyfile
COPY package.json yarn.lock webpack.config.js /code/
RUN yarn install

COPY ./src /code/src
RUN yarn build
