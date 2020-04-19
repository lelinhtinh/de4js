FROM ruby
EXPOSE 4000
WORKDIR /app
COPY . .
RUN gem install bundler && bundle install
CMD [ "bundle", "exec", "jekyll", "serve", "--host=0.0.0.0" ]
