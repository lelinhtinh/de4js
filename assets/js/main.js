// by Zzbaivong - https://baivong.github.io

(function () {

    function format() {
        var source = output.value;

        if (beautify.checked) source = js_beautify(source, {
            unescape_strings: true,
            jslint_happy: true
        });
        if (highlight.checked) source = hljs.highlight('javascript', source).value;

        view[(highlight.checked ? 'innerHTML' : 'textContent')] = source || clearText;
    }

    function decode() {
        var source = input.value,
            packer = bvDecode.encode.value;

        if (source.trim() === '') return;

        view.textContent = clearText;
        output.value = '';

        source = source.trim();

        if (packer === 'evalencode') {
            window._eval = window.eval;
            window.eval = function (_source) {
                source = _source;
            };
            try {
                window._eval(source);
            } catch (err) {}
            window.eval = window._eval;
        } else if (packer === '_numberencode') {
            try {
                var patt = /_\d{4}\((_\d{4})\)\;\}/,
                    _source = source;
                if (!patt.test(_source)) return;

                _source = _source.replace(/var\s/g, 'this.');
                _source = _source.replace(/function\s(_\d{4})\(/, 'this.$1=function(');
                _source = _source.replace(patt, 'window.sourceNumberEncodeZz=$1;};');

                _source = '(function(){' + _source + '})();';
                eval(_source);

                source = window.sourceNumberEncodeZz;
            } catch (err) {}
        } else if (packer === 'arrayencode') {
            try {
                var pattsplit = /(?:[^\\])"];/,
                    lastchar = '';
                if (!pattsplit.test(source)) return;

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
            } catch (err) {}
        } else if (packer === 'urlencode' && Urlencoded.detect(source)) {
            source = Urlencoded.unpack(source);
        } else if (packer === 'p_a_c_k_e_r' && P_A_C_K_E_R.detect(source)) {
            source = P_A_C_K_E_R.unpack(source);
        } else if (packer === 'javascriptobfuscator' && JavascriptObfuscator.detect(source)) {
            source = JavascriptObfuscator.unpack(source);
        } else if (packer === 'myobfuscate' && MyObfuscate.detect(source)) {
            source = MyObfuscate.unpack(source);
        }

        output.value = source;
        format();
    }

    function textreset() {
        if (copyjs.textContent === 'Copy') return;
        copyjs.textContent = 'Copy';
        copyjs.removeAttribute('style');
    }

    function timereset() {
        copytimeout = setTimeout(function () {
            textreset();
        }, 3000);
    }


    var input = document.getElementById('input'),
        output = document.getElementById('output'),
        view = document.getElementById('view'),

        encode = document.getElementsByName('encode'),

        beautify = document.getElementById('beautify'),
        highlight = document.getElementById('highlight'),

        copyjs = document.getElementById('copyjs'),
        redecode = document.getElementById('redecode'),
        clear = document.getElementById('clear'),

        clipboard = new Clipboard('#copyjs'),
        copytimeout,

        clearText = 'Please choose a right encoding type!';

    input.oninput = decode;
    for (var i = 0; i < encode.length; i++) {
        encode[i].onchange = decode;
    }

    beautify.onchange = format;
    highlight.onchange = format;

    copyjs.onmouseout = function () {
        textreset();
        clearTimeout(copytimeout);
    };
    clipboard.on('success', function (e) {
        e.trigger.textContent = 'Copied';
        e.trigger.style.color = '#b5e853';
        e.clearSelection();
        timereset();
    });
    clipboard.on('error', function (e) {
        e.trigger.textContent = 'Selected';
        e.trigger.style.color = '#ff2323';
        timereset();
    });

    redecode.onclick = function () {
        input.value = output.value;
        decode();
    }

    clear.onclick = function () {
        input.value = '';
        output.value = '';
        view.textContent = clearText;
        delete window.sourceEvalEncodeZz;
        delete window.sourceNumberEncodeZz;
    }

})();
