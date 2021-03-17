FROM node:14

WORKDIR /usr/src/app

COPY build ./build
COPY server ./server

RUN npm install express express-http-proxy path jsdom node-fetch node-cache @navikt/nav-dekoratoren-moduler

EXPOSE 8080

CMD ["node", "./server/server.js"]
