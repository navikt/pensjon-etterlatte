FROM node:14

WORKDIR /usr/src/app
COPY . .

RUN npm install express path mustache-express promise prom-client dotenv jsdom request

EXPOSE 8080

CMD ["node", "./server.js"]