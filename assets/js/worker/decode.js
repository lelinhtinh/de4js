---
---
self.addEventListener('message', function (e) {
    var source = e.data.source,
        packer = e.data.packer;

    if (packer === 'evalencode') {
        self._eval = self.eval;
        self.eval = function (_source) {
            source = _source;
        };
        try {
            self._eval(source);
        } catch (err) {}
        self.eval = self._eval;
    } else if (packer === '_numberencode') {
        try {
            var patt = /_\d{4}\((_\d{4})\)\;\}/,
                _source = source;

            if (patt.test(_source)) {
                _source = _source.replace(/var\s/g, 'this.');
                _source = _source.replace(/function\s(_\d{4})\(/, 'this.$1=function(');
                _source = _source.replace(patt, 'self.sourceNumberEncodeZz=$1;};');

                _source = '(function(){' + _source + '})();';
                eval(_source);

                source = self.sourceNumberEncodeZz;
            }
        } catch (err) {}
    } else if (packer === 'arrayencode') {
        try {
            var pattsplit = /(?:[^\\])"];/,
                lastchar = '';

            if (pattsplit.test(source)) {
                lastchar = source.match(pattsplit)[0].charAt(0);

                var _source = source.split(pattsplit),
                    _var = _source[0] + lastchar + '"]',
                    _name = _var.match(/var\s([\w\d]+)\s?=\s?\["/)[1],
                    _code = _source[1],

                    pattname = new RegExp('var\\s' + _name + '\\s?=\\s?\\["'),
                    pattkey = new RegExp(_name + '\\[(\\d+)\\]', 'g'),

                    escapable = /[\\\"\x00-\x1f\x7f-\uffff]/g,
                    meta = {
                        '\b': '\\b',
                        '\t': '\\t',
                        '\n': '\\n',
                        '\f': '\\f',
                        '\r': '\\r',
                        '"': '\\"',
                        '\\': '\\\\'
                    },
                    quote = function (string) {
                        escapable.lastIndex = 0;
                        return escapable.test(string) ?
                            string.replace(escapable, function (a) {
                                var c = meta[a];
                                return typeof c === 'string' ? c :
                                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                            }) : string;
                    };

                _var = _var.replace(pattname, '["');
                _var = eval(_var);

                _code.replace(pattkey, function (key, index) {
                    _code = _code.replace(key, '"' + quote(_var[index]) + '"');
                    return _code;
                });

                _source = _code.replace(/(\["([a-z\d\_]+)"\])/gi, '.$2');
                source = _source;
            }
        } catch (err) {}
    } else if (packer === 'jsfuck') {
        // https://codegolf.stackexchange.com/a/28745
        try {
            source = /.+(?=\n})/.exec(eval(source.slice(0,-2)));
        } catch (err) {}
    } else if (packer === 'aaencode') {
        try {
            self.importScripts('{{ "/assets/js/lib/cat-in-136/aadecode.js?v=" | append: site.github.build_revision | relative_url }}');

            source = AADecode.decode(source);
        } catch (err) {}
    } else if (packer === 'jjencode') {
        try {
            self.importScripts('{{ "/assets/js/lib/decoder-jjencode/jjdecode.js?v=" | append: site.github.build_revision | relative_url }}');

            source = JJdecode.decode(source);
        } catch (err) {}
    } else if (packer === 'urlencode') {
        try {
            self.importScripts('{{ "/assets/js/lib/js-beautify/unpackers/urlencode_unpacker.js?v=" | append: site.github.build_revision | relative_url }}');

            if (Urlencoded.detect(source)) source = Urlencoded.unpack(source);
        } catch (err) {}
    } else if (packer === 'p_a_c_k_e_r') {
        try {
            self.importScripts('{{ "/assets/js/lib/js-beautify/unpackers/p_a_c_k_e_r_unpacker.js?v=" | append: site.github.build_revision | relative_url }}');

            if (P_A_C_K_E_R.detect(source)) source = P_A_C_K_E_R.unpack(source);
        } catch (err) {}
    } else if (packer === 'javascriptobfuscator') {
        try {
            self.importScripts('{{ "/assets/js/lib/js-beautify/unpackers/javascriptobfuscator_unpacker.js?v=" | append: site.github.build_revision | relative_url }}');

            if (JavascriptObfuscator.detect(source)) source = JavascriptObfuscator.unpack(source);
        } catch (err) {}
    } else if (packer === 'myobfuscate') {
        try {
            self.importScripts('{{ "/assets/js/lib/js-beautify/unpackers/myobfuscate_unpacker.js?v=" | append: site.github.build_revision | relative_url }}');

            if (MyObfuscate.detect(source)) source = MyObfuscate.unpack(source);
        } catch (err) {}
    }

    self.postMessage(source);
});