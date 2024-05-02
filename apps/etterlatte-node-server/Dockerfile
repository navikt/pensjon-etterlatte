FROM node:bookworm-slim

WORKDIR /app
ENV APP_NAME=${APP_NAME}
COPY apps/etterlatte-node-server/dist ./server
COPY apps/etterlatte-node-server/node_modules ./node_modules
COPY apps/$APP_NAME ./build

RUN echo $APP_NAME
ENV NODE_ENV="production"

EXPOSE 8080

CMD ["./server/server.js"]
