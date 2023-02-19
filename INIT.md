# 環境構築

## STEP: 1
### dockerファイルの配置
- プロジェクトルートにdocker-compose.ymlを作成
#### ./docker-compose.yml
```yml
version: '3.8'

x-common: &common
  platform: linux/amd64
  tty: true
  environment:
    NODE_ENV: development
    DATABASE_URL: postgresql://docker:secret@db:5432/grndb?schema=public
    TZ: Asia/Tokyo
  volumes:
    - .:/app

services:
  db:
    container_name: db
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: grndb
      TZ: Asia/Tokyo
    volumes:
      - ./db/postgres/init.d:/docker-entrypoint-initdb.d
      - ./db/postgres/pgdata:/var/lib/postgresql/data
    ports:
      - 5432:5432

  server:
    << : *common
    build:
      context: .
      dockerfile: ./dockerfiles/server/Dockerfile
    container_name: server
    command: yarn start:dev
    depends_on:
      - db
    ports:
      - 3300:3300
      - 5555:5555

  client:
    << : *common
    build:
      context: .
      dockerfile: ./dockerfiles/client/Dockerfile
    container_name: client
    command: yarn dev
    depends_on:
      - server
    ports:
      - 3000:3000
      - 8080:8080
```

- server/client用のDockerfileを作成
#### ./dockerfiles/server/Dockerfile
```Dockerfile
FROM node:18.14.0-slim

WORKDIR /app/server

RUN apt-get update && \
    apt-get -y install procps

RUN yarn global add @nestjs/cli

RUN yarn install

COPY . .
```

#### ./dockerfiles/client/Dockerfile
```Dockerfile
FROM node:18.14.0-slim

WORKDIR /app/client

RUN yarn install

COPY . .
```

```sh
$ docker-compose build
```

## STEP: 2
### サーバーの設定
```sh
$ docker-compose run --rm server nest new . --strict
```

- ポート3000はクライアント側で利用するので、3300に変更する
#### ./server/src/main.ts
```diff
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
- await app.listen(3000);
+ await app.listen(3300);
}
bootstrap();
```