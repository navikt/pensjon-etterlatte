FROM node:14

WORKDIR /usr/src/app

COPY build ./build
COPY buildServer ./server
COPY src/assets/locales ./server/locales

ENV NODE_ENV="production"

<<<<<<< HEAD
RUN npm install express express-http-proxy express-session path jsdom node-fetch@2.6.1 node-cache jsonwebtoken ulid node-jose winston openid-client redis connect-redis @navikt/nav-dekoratoren-moduler i18next@21.5.1 prom-client @types/connect-redis @types/express @types/express-http-proxy @types/jsonwebtoken @types/node-fetch@2.5.12 @types/node-jose @types/redis
=======
RUN npm install express express-http-proxy express-session path jsdom node-fetch@2.6.1 node-cache jsonwebtoken ulid node-jose winston winston-transport openid-client redis connect-redis @navikt/nav-dekoratoren-moduler i18next@20.4.0 prom-client
>>>>>>> main

EXPOSE 8080

CMD ["node", "./server/server.js"]
