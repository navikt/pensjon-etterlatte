FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /usr/src/app

COPY build ./server
COPY node_modules ./node_modules

USER nonroot
ENV NODE_ENV="production"

EXPOSE 8080

CMD ["./server/server.js"]
