FROM node:22.12.0-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 5173

CMD [ "npm","run","dev","--","--host"]