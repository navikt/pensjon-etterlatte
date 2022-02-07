FROM node:14

WORKDIR /usr/src/app

COPY client/build ./build
COPY server/build ./server
COPY server/node_modules ./node_modules

ENV NODE_ENV="production"

EXPOSE 8080

CMD ["node", "./server/server.js"]
