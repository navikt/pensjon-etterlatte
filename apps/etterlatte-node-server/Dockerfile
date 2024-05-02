FROM node:bookworm-slim

WORKDIR /app

ARG app_name
ENV APP_NAME=${app_name}

COPY apps/etterlatte-node-server/dist ./server
COPY apps/etterlatte-node-server/node_modules ./node_modules
COPY apps/$APP_NAME/build ./build

ENV NODE_ENV="production"
EXPOSE 8080

CMD ["./server/server.js"]
