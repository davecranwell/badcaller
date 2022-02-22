FROM arm32v7/node:14.18.1-alpine3.12 as builderserver
RUN apk update
# linux headers required for serial.h
RUN apk add linux-headers --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main
RUN apk --no-cache add --virtual build-deps build-base python2 make gcc g++ udev

# Copy only package.json of the client across so server can build reading the version 
# for broadcast to the front end
WORKDIR /app/client
COPY ./client/package.json ./
WORKDIR /app/server
COPY ./server/package.json ./server/package-lock.json ./server/tsconfig.json ./
ENV NODE_ENV=production
RUN npm ci --only=production
COPY ./server/src ./src
COPY ./server/config ./config
RUN npm run build

FROM arm32v7/node:16-alpine as builderclient
WORKDIR /app/client
COPY ./client/package.json ./client/package-lock.json ./
ENV NODE_ENV=production
RUN npm ci --only=production

COPY ./client/public ./public
COPY ./client/src ./src
RUN npm run build

# NB: https://github.com/nodejs/docker-node/issues/1589
# It seems many alpine images do not work with node, so a very specific version is needed
FROM arm32v7/node:14.18.1-alpine3.12
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