FROM node:bookworm-slim

WORKDIR /app
ENV APP_NAME=${APP_NAME}
COPY apps/etterlatte-node-server/dist ./server
COPY apps/etterlatte-node-server/node_modules ./node_modules
COPY apps/$APP_NAME ./build

ENV NODE_ENV="production"

EXPOSE 8080
ENV BASE_PATH="/"
ENV API_URL="http://vg.no"
ENV AUDIENCE="blalba"

CMD ["./server/server.js"]
