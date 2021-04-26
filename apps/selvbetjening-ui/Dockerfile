FROM node:14

WORKDIR /usr/src/app

COPY build ./build
COPY server ./server

RUN npm install express express-http-proxy express-session \
    && path jsdom node-fetch node-cache winston openid-client \
    && redis connect-redis @navikt/nav-dekoratoren-moduler

EXPOSE 8080

CMD ["node", "./server/server.js"]
