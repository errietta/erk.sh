FROM keymetrics/pm2:latest-alpine

RUN apk add --update python3 alpine-sdk

RUN mkdir /home/node/app
RUN chown -R node:node /home/node

COPY package-lock.json package.json /home/node/app/
WORKDIR /home/node/app

USER node

RUN npm ci

COPY . /home/node/app

CMD pm2-runtime server/index.js
