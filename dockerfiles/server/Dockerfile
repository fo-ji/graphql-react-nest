FROM node:18.14.0-slim

WORKDIR /app/server

RUN apt-get update && \
    apt-get -y install procps

RUN yarn global add @nestjs/cli

RUN yarn install

COPY . .
