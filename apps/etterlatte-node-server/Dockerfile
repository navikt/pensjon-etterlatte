FROM node:20-bookworm-slim

WORKDIR /usr/src/app

COPY build ./server
COPY node_modules ./node_modules

ENV NODE_ENV="production"

EXPOSE 8080

CMD ["node", "./server/server.js"]
