FROM node:bookworm-slim

WORKDIR /app

ARG base_path

ENV APP_NAME=${app_name}

COPY dist ./server
COPY node_modules ./node_modules
COPY barnepensjon-ui/build ./build

ENV NODE_ENV="production"
EXPOSE 8080

CMD ["./server/server.js"]
