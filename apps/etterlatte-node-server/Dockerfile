FROM node:bookworm-slim

WORKDIR /app

ARG app_name

ENV APP_NAME=${app_name}

COPY dist ./server
COPY node_modules ./node_modules
COPY .$APP_NAME/build ./build

ENV NODE_ENV="production"
EXPOSE 8080

CMD ["./server/server.js"]
