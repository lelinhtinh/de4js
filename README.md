# de4js

![Logo](assets/images/icons/icon-128x128.png)

JavaScript Deobfuscator and Unpacker

## Helper

The **Unreadable** option is disabled by default, because it uses data from [JS Nice](http://www.jsnice.org/). This cannot be done with JavaScript. You need to install UserScript [de4js_helper.user.js](https://github.com/lelinhtinh/de4js/blob/master/userscript/de4js_helper.user.js) to enable it.

Install one of the following links:

- [Open User JS](https://openuserjs.org/scripts/baivong/de4js_helper)
- [Greasy Fork](https://greasyfork.org/vi/scripts/33479-de4js-helper)
- [Github](https://lelinhtinh.github.io/de4js/userscript/de4js_helper.user.js)

`*` _**de4js helper** doesn't work offline._

## Features

- Works offline.
- Source code beautifier / syntax highlighter.
- Makes obfuscated code [readable](#helper).
- Performance unpackers:
  - **Eval**, e.g. Packer, WiseLoop
  - **Array**, e.g. Javascript Obfuscator, Free JS Obfuscator
  - [_Number](https://jsfiddle.net/ps5anL99/embedded/result,js,html,css/) _(not correct name)_
  - [Packer](http://dean.edwards.name/packer/)
  - [Javascript Obfuscator](https://javascriptobfuscator.com/Javascript-Obfuscator.aspx)
  - [Free JS Obfuscator](http://www.freejsobfuscator.com/)
  - [Obfuscator.IO](https://obfuscator.io/) _(but not all cases)_
  - [My Obfuscate](http://myobfuscate.com/)
  - **URL encode**, e.g. bookmarklet
  - [JSFuck](https://github.com/aemkei/jsfuck)
  - [JJencode](http://utf-8.jp/public/jjencode.html)
  - [AAencode](http://utf-8.jp/public/aaencode.html)
  - [WiseLoop](http://wiseloop.com/demo/php-javascript-obfuscator)

## Running with Docker

    docker-compose up

Preview **de4js** in your web browser at <http://localhost:4000/de4js/>

### Attach Shell

    docker exec -it de4js_app bash
    bundle exec jekyll build

## Local Development

### Install

    git clone https://github.com/lelinhtinh/de4js.git
    cd de4js

If you don't have Ruby installed, install [Ruby 2.1.0 or higher](https://www.ruby-lang.org/en/downloads/).

Fix missing libraries on **Ubuntu**:

    sudo apt install ruby-dev zlib1g-dev

Install **Bundler**:

    gem install bundler

Install **Jekyll** and other [dependencies](https://pages.github.com/versions/) from the GitHub Pages gem:

    bundle install

Fix EventMachine C extension not loading on **Windows 10**:

    gem uninstall eventmachine
    gem install eventmachine --platform ruby

Install Workbox CLI:

    npm install workbox-cli --global

### Start serve

    npm start

Or, with livereload:

    npm run watch

Preview **de4js** in your web browser at <http://localhost:4000/de4js/>

### Build

    npm run build

## License

[MIT License](https://baivong.mit-license.org/) © [lelinhtinh](https://github.com/lelinhtinh)

## Credits

### Active Contributors

- [lelinhtinh](https://github.com/lelinhtinh)
- [Himura2la](https://github.com/Himura2la)
- [Flleeppyy](https://github.com/flleeppyy)

### Open Source Contributors

- [mathjs](https://github.com/josdejong/mathjs)
- [js-beautify](https://github.com/beautify-web/js-beautify)
- [highlight.js](https://github.com/isagalaev/highlight.js)
- [clipboard.js](https://github.com/zenorocha/clipboard.js)
- [magic-check](https://github.com/forsigner/magic-check)
- [cat-in-136](https://cat-in-136.github.io/2010/12/aadecode-decode-encoded-as-aaencode.html)
- [Decoder-JJEncode](https://github.com/jacobsoo/Decoder-JJEncode)
- [NotSoWise](https://github.com/FAKE1007/NotSoWise)

### Resources

- Icons made by [Eucalyp](https://www.flaticon.com/free-icon/artificial-intelligence_653469) from [Flaticon](https://www.flaticon.com/).

## Related projects

- [IlluminateJS](https://github.com/geeksonsecurity/illuminatejs): A static JavaScript deobfuscator.
- [JStillery](https://github.com/mindedsecurity/JStillery): Advanced JavaScript Deobfuscation via Partial Evaluation.
- [Akamai Deobfuscator](https://github.com/char/akamai-deobfuscator): A tool to help you deobfuscate Akamai scripts.
- [Nice2Predict](https://github.com/eth-sri/Nice2Predict): Learning framework for program property prediction.
- [Javascript deobfuscation AMA](https://github.com/jsoverson/javascript-deobfuscation-AMA): General questions about deobfuscating JavaScript.
- [Deobfuscator IO](https://github.com/sd-soleaio/deobfuscator-io): A (incomplete) deobfuscator for scripts obfuscated with obfuscator.io (Archived).
- [JavaScript Deobfuscator](https://github.com/LostMyCode/javascript-deobfuscator): Deobfuscation tool for obfuscated JavaScript using obfuscator.io.
- [Prepack](https://github.com/facebook/prepack): A JavaScript bundle optimizer.
- [JS Deobfuscate](https://github.com/RuochenLyu/js-deobfuscate): JavaScript deobfuscate for JSjiami, Sojson, ...
- [JSDec](https://github.com/liulihaocai/JSDec): Online JavaScript decoder. Supported sojson v4/Premium/v5 and more (No longer update).
- [Synchrony](https://github.com/uwu/synchrony): Kavascript-obfuscator cleaner & deobfuscator.

`*` _[**Obfuscator.IO**](https://obfuscator.io/) is always up to date. The automatic deobfuscation tools (including this project) will usually not match its latest version. But that doesn't mean it's a safe tool to secure your source code._
