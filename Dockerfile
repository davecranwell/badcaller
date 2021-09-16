FROM arm32v7/node:14-alpine as builderserver
RUN apk update
# linux headers required for serial.h
RUN apk add linux-headers --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main
RUN apk --no-cache add --virtual build-deps build-base python make gcc g++ udev

WORKDIR /app/lib
COPY ./lib ./lib

WORKDIR /app/server
COPY ./server/package.json ./server/package-lock.json ./server/tsconfig.json ./
ENV NODE_ENV=production
RUN npm ci
COPY ./server/src ./src
COPY ./server/config ./config
RUN npm run build

FROM arm32v7/node:14-alpine as builderclient
WORKDIR /app/client
COPY ./client/package.json ./client/package-lock.json ./client/craco.config.js ./
COPY ./client/config ./config
ENV NODE_ENV=production
RUN npm ci

COPY ./client/public ./public
COPY ./client/src ./src
RUN npm run build

FROM arm32v7/node:14-alpine
WORKDIR /app/server
COPY ./server/package.json ./
COPY --from=builderserver /app/server/node_modules ./node_modules
COPY --from=builderserver /app/server/build ./build
COPY --from=builderserver /app/server/config ./config 

WORKDIR /app/client/build
COPY --from=builderclient /app/client/build ./

WORKDIR /app/server
ENV NODE_ENV=production
CMD [ "npm", "start" ]