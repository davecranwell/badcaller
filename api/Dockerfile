FROM node:alpine

WORKDIR /app
COPY ./package.json ./package-lock.json ./tsconfig.json ./
ENV NODE_ENV=production
RUN npm ci
COPY . .
CMD [ "npm", "start" ]
