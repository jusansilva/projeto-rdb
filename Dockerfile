FROM node:12

WORKDIR /app

RUN apt-get update

RUN npm install -g typescript

COPY package.json /app

RUN npm install

COPY . /app

RUN node_modules/.bin/snowboard html -o docs api.apib

EXPOSE 3000
