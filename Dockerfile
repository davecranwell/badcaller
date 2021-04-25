FROM arm32v7/node:14-alpine as builder

RUN apk update
# linux headers required for serial.h
RUN apk add linux-headers --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main
RUN apk --no-cache add --virtual build-deps build-base python make gcc g++ udev

WORKDIR /app/server
COPY ./server/package*.json ./server/tsconfig.json ./
RUN npm install --production
COPY ./server/src ./src
COPY ./server/config ./config
RUN npm run build

WORKDIR /app/client
COPY ./client/package*.json ./
RUN npm install
COPY ./client/public ./public
COPY ./client/src ./src
RUN npm run build

FROM arm32v7/node:14-alpine

WORKDIR /app/server
COPY ./server/package.json ./
COPY --from=builder /app/server/node_modules ./node_modules
COPY --from=builder /app/server/build ./build
COPY --from=builder /app/server/config ./config 

WORKDIR /app/client
COPY --from=builder /app/client/build ./

WORKDIR /app/server
ENV NODE_ENV=production
CMD [ "npm", "start" ]