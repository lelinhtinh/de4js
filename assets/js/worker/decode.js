---
---
/**
 * @name  {{ site.name }}
 * @description  {{ site.description }}
 * @author  {{ site.author }} <{{ site.author_email }}> ({{ site.url }})
 * @version  {{ site.version }}
 * @copyright  {{ site.author }} 2017
 * @license  {{ site.license }}
 */

/* globals AADecode, JJdecode, Urlencoded, P_A_C_K_E_R, JavascriptObfuscator, MyObfuscate */
/* eslint-disable no-console */

self.addEventListener('message', function (e) {
    var source = e.data.source,
        packer = e.data.packer;

    var methods = {
        evalencode: function () {
            self._eval = self.eval;
            self.eval = function (_evalsource) {
                return _evalsource;
            };
            setTimeout(function () {
                self.eval = self._eval;
            }, 0);
            return self._eval(source);
        },
        _numberencode: function () {
            var patt = /_\d{4}\((_\d{4})\);\}/,
                _numbersource = source;

            if (!patt.test(_numbersource)) throw 'Not matched';

            _numbersource = _numbersource.replace(/var\s/g, 'this.');
            _numbersource = _numbersource.replace(/function\s(_\d{4})\(/, 'this.$1=function(');
            _numbersource = _numbersource.replace(patt, 'self.sourceNumberEncodeZz=$1;};');

            _numbersource = '(function(){' + _numbersource + '})();';
            eval(_numbersource);

            return self.sourceNumberEncodeZz;
        },
        arrayencode: function () {
            var pattarr = /[\s\n]*var\s+([\w\d_$]+)\s*=\s*\[.*?\];/,
                _var = source.match(pattarr);

            if (!_var || _var.length !== 2) throw 'Not matched';

            var _name = _var[1],
                _code = source.replace(pattarr, ''),

                quote = function (s, q) {
                    return s.replace(new RegExp('[\\n*+?^${}()|[\\]\\\\' + q + ']', 'g'), '\\$&');
                },

                pattkey = new RegExp(_name.replace(/\$/g, '\\$') + '\\[(\\d+)\\]', 'g');

            _var = _var[0].replace(/[\s\S]*?\[/, '[');
            _var = eval(_var);

            _code = _code.split(';');
            _code = _code.map(function (piece) {
                piece.replace(pattkey, function (key, index) {
                    var item = _var[index],
                        q = item.indexOf('"') !== -1 ? "'" : '"';

                    piece = piece.replace(key, q + quote(item, q) + q);

                    return piece;
                });

                return piece;
            });
            _code = _code.join(';');

            _code = _code.replace(/(\[("|')((?!\d)[a-z_\d$]+)("|')\])/gi, '.$3 ');

            return _code;
        },
        jsfuck: function () {
            var pattfuck = /\)(\(\)[\s\n]*)$/,
                pattanon = /^[\s\n]*function\sanonymous\([\s\n]+\)\s\{[\s\n]+/,
                _fucksource = source;

            if (pattfuck.test(source)) _fucksource = _fucksource.replace(pattfuck, ')');
            _fucksource = eval(_fucksource + '.toString()');

            if (pattanon.test(_fucksource)) {
                _fucksource = _fucksource.replace(pattanon, '');
                _fucksource = _fucksource.replace(/[\s\n]+\}[\s\n]*$/, '');
            }

            return _fucksource;
        },
        aaencode: function () {
            self.importScripts('{{ "/assets/js/lib/cat-in-136/aadecode.js" | relative_url }}');
            return AADecode.decode(source);
        },
        jjencode: function () {
            self.importScripts('{{ "/assets/js/lib/decoder-jjencode/jjdecode.js" | relative_url }}');
            return JJdecode.decode(source);
        },
        urlencode: function () {
            self.importScripts('{{ "/assets/js/lib/js-beautify/unpackers/urlencode_unpacker.js" | relative_url }}');
            if (Urlencoded.detect(source)) return Urlencoded.unpack(source);
            throw 'Not matched';
        },
        p_a_c_k_e_r: function () {
            self.importScripts('{{ "/assets/js/lib/js-beautify/unpackers/p_a_c_k_e_r_unpacker.js" | relative_url }}');
            if (P_A_C_K_E_R.detect(source)) return P_A_C_K_E_R.unpack(source);
            throw 'Not matched';
        },
        javascriptobfuscator: function () {
            self.importScripts('{{ "/assets/js/lib/js-beautify/unpackers/javascriptobfuscator_unpacker.js" | relative_url }}');
            if (JavascriptObfuscator.detect(source)) return JavascriptObfuscator.unpack(source);
            throw 'Not matched';
        },
        myobfuscate: function () {
            self.importScripts('{{ "/assets/js/lib/js-beautify/unpackers/myobfuscate_unpacker.js" | relative_url }}');
            if (MyObfuscate.detect(source)) return MyObfuscate.unpack(source);
            throw 'Not matched';
        }
    };

    try {
        source = methods[packer]();
    } catch (err) {
        console.log(err);
    }

    self.postMessage(source);
});
