FROM node:bookworm-slim

WORKDIR /app

ARG base_path
ARG app_name
ARG api_url
ARG audience

ENV APP_NAME=${app_name}
ENV BASE_PATH=${base_path}
ENV API_URL=${api_url}
ENV AUDIENCE=${audience}

COPY dist ./server
COPY node_modules ./node_modules
COPY $APP_NAME/build ./build

ENV NODE_ENV="production"
EXPOSE 8080

CMD ["./server/server.js"]
