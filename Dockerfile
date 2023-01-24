FROM node:18-alpine

COPY . /
WORKDIR /

CMD npm --no-update-notifier start