FROM gcr.io/mirrormedia-1470651750304/node:8.12.0-slim-gyp

ENV NODE_SOURCE /usr/src

RUN groupadd user && useradd --create-home --home-dir /home/user -g user user

WORKDIR $NODE_SOURCE

ADD . $NODE_SOURCE/

EXPOSE 3000
CMD ["yarn", "start"]
