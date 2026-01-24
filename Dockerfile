FROM joseluisq/static-web-server:2-alpine
ENV SERVER_ROOT=/public
ENV SERVER_PORT=8080

COPY . /public