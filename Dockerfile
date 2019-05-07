FROM node:10.15-slim

ENV NODE_SOURCE /usr/src

RUN groupadd user && useradd --create-home --home-dir /home/user -g user user

WORKDIR $NODE_SOURCE

RUN apt-get update \
    && apt-get install -y node-gyp

ADD . $NODE_SOURCE/

EXPOSE 3000
CMD ["yarn", "start"]
