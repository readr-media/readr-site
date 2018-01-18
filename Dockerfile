FROM node:9.2.0-alpine

ENV NODE_SOURCE /usr/src
WORKDIR $NODE_SOURCE

RUN apk update \
    && apk add --no-cache python
ADD . $NODE_SOURCE/
# ADD default/readr-site/config.js $NODE_SOURCE/api/config.js

EXPOSE 3000
CMD ["yarn", "start"]