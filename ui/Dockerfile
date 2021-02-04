FROM node:14.15.4-alpine as builder
LABEL maintainer="Marcelo Fuentes <marceloe.fuentes@gmail.com>"
ENV NODE_ENV=development
ENV HOST=0.0.0.0
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
CMD ["yarn", "start"]