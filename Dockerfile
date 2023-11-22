FROM node:16-alpine
WORKDIR /app
COPY package*.json /app/
COPY . .
# COPY .envdeploy$$environment$$ /app/.env

ENV NODE_ENV production

RUN apk add --no-cache chromium

RUN npm install --production 
RUN npm install -g @adonisjs/cli
RUN npm install @adonisjs/ace@5.1.0 --save
RUN node ace build 
EXPOSE 4204
CMD [ "node", "ace", "serve" ]

