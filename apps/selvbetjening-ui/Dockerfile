FROM node:14

WORKDIR /usr/src/app

COPY build ./build
COPY server ./server

RUN npm install express express-http-proxy path jsdom axios node-cache node-fetch mustache-express

EXPOSE 8080

CMD ["node", "./server/server.js"]
