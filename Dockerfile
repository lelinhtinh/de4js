FROM ruby:2.7-alpine

RUN apk add --no-cache build-base gcc bash cmake git

WORKDIR /srv/jekyll

COPY docker-entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN gem install bundler

ENTRYPOINT [ "docker-entrypoint.sh" ]
