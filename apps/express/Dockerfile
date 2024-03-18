FROM node:18.16.0-alpine as base

ENV NODE_ENV production

WORKDIR /app
COPY package.json .
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000

CMD [ "node", "-r", "dotenv/config", "dist/index.js" ]