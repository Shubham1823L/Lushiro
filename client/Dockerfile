FROM node:24-slim

WORKDIR /app

COPY package*.json .

RUN npm install

ENV VITE_API_BASE_URL=http://localhost:1823/api

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD [ "serve","-s","dist","-l","3000" ]