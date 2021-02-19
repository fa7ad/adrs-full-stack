FROM node:lts-alpine AS development
WORKDIR /home/node/app
RUN apk add curl git yarn tini --no-cache
EXPOSE 3000

COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn prisma generate

ENTRYPOINT [ "/sbin/tini", "--" ]

CMD ["yarn", "dev"]

FROM development AS production

RUN yarn build

CMD ["yarn", "start"]