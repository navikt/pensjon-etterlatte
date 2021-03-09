FROM node:14

WORKDIR /usr/src/app

# COPY . .

# RUN npm install express path

COPY dist ./dist
COPY server.js .
COPY node_modules ./node_modules
COPY package.json .

EXPOSE 8080

CMD ["node", "./server.js"]
