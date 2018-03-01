FROM node:9.2.0-alpine

ENV NODE_SOURCE /usr/src
WORKDIR $NODE_SOURCE

RUN apk update \
    && apk add --no-cache python build-base make \
    && apk add vips-dev fftw-dev --update-cache --repository https://dl-3.alpinelinux.org/alpine/edge/testing/
    
ADD . $NODE_SOURCE/
# ADD default/readr-site/config.js $NODE_SOURCE/api/config.js

EXPOSE 3000
CMD ["yarn", "start"]