FROM alpine:edge

ENV NODE_SOURCE /usr/src

WORKDIR $NODE_SOURCE

RUN apk add --update --repository https://dl-3.alpinelinux.org/alpine/edge/testing/ python build-base make vips-dev fftw-dev \
    && nodejs-current yarn
ADD . $NODE_SOURCE/
# ADD default/readr-site/config.js $NODE_SOURCE/api/config.js

EXPOSE 3000
CMD ["yarn", "start"]
