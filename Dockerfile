FROM node:21-alpine3.18

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5000

CMD ["node", "app.js"]

