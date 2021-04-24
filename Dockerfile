# Fetch node_modules for backend, nothing here except 
# the node_modules dir ends up in the final image
FROM arm32v7/node:14-alpine as builder

RUN apk update
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
WORKDIR /app
COPY ./server/package.json /app/server/
COPY --from=builder /app/server/node_modules /app/server/node_modules
COPY --from=builder /app/server/build /app/server/build
COPY --from=builder /app/server/config /app/server/config 
COPY --from=builder /app/client/build /app/client/

WORKDIR /app/server
ENV NODE_ENV=production
CMD [ "npm", "start" ]