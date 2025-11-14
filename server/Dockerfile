FROM node:24-slim

WORKDIR /app

COPY package*.json .

ENV CLIENT_URL=http://localhost:3000

RUN npm install

COPY . .

EXPOSE 1823

CMD [ "node","server.js" ]