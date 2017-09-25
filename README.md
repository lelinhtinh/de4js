# de4js

JavaScript Deobfuscator and Unpacker

## Helper

The **Unreadable** option is disabled by default, because it uses data from [JS Nice](http://www.jsnice.org/). This cannot be done with JavaScript. You need to install UserScript [de4js_helper.user.js](https://github.com/baivong/de4js/blob/master/de4js_helper.user.js) to enable it.

Install one of the following links:

- [Open User JS](https://openuserjs.org/scripts/baivong/de4js_helper)
- [Greasy Fork](https://greasyfork.org/vi/scripts/33479-de4js-helper)
- [Github](https://github.com/baivong/de4js/raw/master/de4js_helper.user.js) 

## Development

### Install

    git clone https://github.com/baivong/de4js.git
    cd de4js

If you don't have Ruby installed, install [Ruby 2.1.0 or higher](https://www.ruby-lang.org/en/downloads/).

Fix missing libraries on **Ubuntu**:

    sudo apt install ruby-dev zlib1g-dev

Install **Bundler**:

    gem install bundler

Install **Jekyll** and other [dependencies](https://pages.github.com/versions/) from the GitHub Pages gem:

    bundle install

### Run

    bundle exec jekyll serve

Preview **de4js** in your web browser at `http://localhost:4000`

## License

[MIT License](https://baivong.mit-license.org/) © [Zzbaivong](https://baivong.github.io/)

## Credits

### Active Contributors

- [Zzbaivong](https://github.com/baivong)

### Open Source Contributors

- [js-beautify@1.7.3](https://github.com/beautify-web/js-beautify)
- [highlight.js@9.12.0](https://github.com/isagalaev/highlight.js)
- [clipboard.js@1.7.1](https://github.com/zenorocha/clipboard.js)
- [magic-check@1.0.3](https://github.com/forsigner/magic-check)
