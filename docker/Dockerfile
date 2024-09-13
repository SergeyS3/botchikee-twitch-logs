FROM alpine:3.20.2

ENV NODE_VERSION 20.6.1

WORKDIR /usr/src/app

RUN apk add curl libstdc++ libgcc \
    && curl -sL "https://unofficial-builds.nodejs.org/download/release/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64-musl.tar.gz" | tar xz -C /usr/local --strip-components=1
    
CMD ["npm", "run", "start:docker"]
