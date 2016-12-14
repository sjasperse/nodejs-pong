FROM node:7-alpine

RUN mkdir /app

COPY node_modules app/node_modules
COPY server.js app/

CMD node /app/server.js
EXPOSE 3000
