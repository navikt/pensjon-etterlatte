FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:26-slim

WORKDIR /app

COPY dist ./server
COPY node_modules ./node_modules
COPY build ./build

USER nonroot
ENV NODE_ENV="production"
EXPOSE 8080

CMD ["./server/server.js"]
