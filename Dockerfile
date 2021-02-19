FROM node:lts-alpine AS development

WORKDIR /home/node/app
RUN apk add curl git yarn --no-cache

COPY package.json yarn.lock ./
RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]

FROM development AS production

RUN yarn build

CMD ["yarn", "start"]