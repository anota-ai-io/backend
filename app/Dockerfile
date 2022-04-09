FROM node:16-alpine

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --silent

COPY . . 