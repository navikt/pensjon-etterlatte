FROM node:14

WORKDIR /usr/src/app

COPY build ./build
COPY server ./server

ENV NODE_ENV="production"

RUN npm install express express-http-proxy express-session path jsdom node-fetch@2.6.1 node-cache jsonwebtoken ulid node-jose winston openid-client redis connect-redis @navikt/nav-dekoratoren-moduler

EXPOSE 8080

CMD ["node", "./server/server.js"]
