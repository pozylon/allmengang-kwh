FROM node:18-alpine

COPY . /
WORKDIR /

RUN npm install --omit-dev

CMD npm --no-update-notifier start