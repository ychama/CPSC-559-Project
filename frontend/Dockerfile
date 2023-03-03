FROM node:14.16.1-alpine3.13

WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]