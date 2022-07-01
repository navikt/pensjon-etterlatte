FROM node:14

COPY . .

RUN yarn
RUN yarn build

EXPOSE 3333
CMD ["node", "server.js"]