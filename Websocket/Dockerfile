FROM node:current-alpine3.20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx tsc

EXPOSE 3002

CMD ["node", "dist/index.js"]