FROM node:19-alpine3.15

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "src/index.js" ]