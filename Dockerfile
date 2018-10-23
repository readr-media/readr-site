FROM node:8.12.0-slim

ENV NODE_SOURCE /usr/src

RUN groupadd user && useradd --create-home --home-dir /home/user -g user user

WORKDIR $NODE_SOURCE

RUN apt-get update \
    && apt-get install -y node-gyp
 
#RUN apk add --update --repository https://dl-3.alpinelinux.org/alpine/edge/testing/ python build-base make vips-dev fftw-dev \
#    && nodejs-current yarn
ADD . $NODE_SOURCE/
# ADD default/readr-site/config.js $NODE_SOURCE/api/config.js

EXPOSE 3000
CMD ["yarn", "start"]
