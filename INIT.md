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

### GraphQLの設定
```sh
$ docker-compose run --rm server yarn add @nestjs/graphql @nestjs/apollo graphql apollo-server-express
```
#### ./server/src/app.module.ts
```diff
+ import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
+ import { GraphQLModule } from '@nestjs/graphql';
+ import { join } from 'path';

@Module({
+   imports: [
+     GraphQLModule.forRoot<ApolloDriverConfig>({
+       driver: ApolloDriver,
+       playground: true, // MEMO: GUIを利用する
+       autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
+       cors: {
+         origin: '*',
+       },
+     }),
+   ],
})
export class AppModule {}
```

#### MEMO(create Resolver command)
```sh
$ docker-compose run --rm server nest g resolver task --no-spec
```

#### MEMO(GraphQL playground)
```
http://localhost:3300/graphql
```

#### MEMO(validation libs)
```sh
$ docker-compose run --rm server yarn add class-validator class-transformer
```

## STEP: 3
### DB & Prismaの設定
#### 接続確認
```sh
$ docker-compose up -d
$ docker exec -it db sh
$ psql -U docker grndb
```

#### Setup Prisma
```sh
$ docker-compose run --rm server yarn add -D prisma
$ docker-compose run --rm server npx prisma init
$ docker-compose run --rm server npx prisma migrate dev --name init
$ docker exec -it server sh
$ npx prisma studio
$ nest g module prisma
$ nest g service prisma --no-spec
```

## STEP: 4
### Authの設定
```sh
$ docker-compose run --rm server yarn add bcrypt @types/bcrypt
$ docker-compose run --rm server yarn add -D @types/bcrypt
$ docker-compose run --rm server nest g module auth
$ docker-compose run --rm server nest g resolver auth --no-spec
$ docker-compose run --rm server nest g service auth --no-spec
$ docker-compose run --rm server nest g service auth --no-spec
$ docker-compose run --rm server yarn add @nestjs/passport passport passport-local
$ docker-compose run --rm server yarn add -D @types/passport-local
$ docker-compose run --rm server yarn add @nestjs/jwt passport-jwt
$ docker-compose run --rm server yarn add -D @types/passport-jwt
```

## STEP: 5
### クライアントの設定
```sh
$ docker-compose run --rm client yarn create vite .
$ docker-compose run --rm client yarn install
$ docker-compose run --rm client yarn add -D vite-tsconfig-paths
```
#### package.json
```diff
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
-    "dev": "vite",
+    "dev": "vite --host",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "@vitejs/plugin-react": "^3.1.0",
    "typescript": "^4.9.3",
    "vite": "^4.1.0"
  }
}
```
#### vite.config.ts
```diff
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
+ import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
-  plugins: [react()],
+  plugins: [react(), tsconfigPaths()],
});
```
#### install libs
```sh
$ docker exec -it client sh
$ yarn add modern-css-reset
$ yarn add @mui/material @emotion/react @emotion/styled
$ yarn add @mui/icons-material
$ yarn add react-router-dom
$ yarn add @apollo/client graphql
$ yarn add jwt-decode
```