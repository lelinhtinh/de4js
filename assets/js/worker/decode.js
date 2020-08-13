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

/* globals EvalDecode, ArrayDecode, _NumberDecode, JSFuckDecode, ObfuscatorIO, AADecode, JJdecode, Urlencoded, P_A_C_K_E_R, JavascriptObfuscator, MyObfuscate */
/* eslint-disable no-console */

self.addEventListener('message', function (e) {
    var source = e.data.source,
        packer = e.data.packer;

    var methods = {
        evalencode: function () {
            self.importScripts('{{ "/assets/js/lib/evaldecode.js" | relative_url }}');
            return EvalDecode(source);
        },
        _numberencode: function () {
            self.importScripts('{{ "/assets/js/lib/numberdecode.js" | relative_url }}');
            return _NumberDecode(source);
        },
        arrayencode: function () {
            self.importScripts('{{ "/assets/js/lib/utils.js" | relative_url }}');
            self.importScripts('{{ "/assets/js/lib/arraydecode.js" | relative_url }}');
            return ArrayDecode(source);
        },
        jsfuck: function () {
            self.importScripts('{{ "/assets/js/lib/jsfuckdecode.js" | relative_url }}');
            return JSFuckDecode(source);
        },
        obfuscatorio: function () {
            self.importScripts('{{ "/assets/js/lib/utils.js" | relative_url }}');
            self.importScripts('{{ "/assets/js/lib/obfuscatorio.js" | relative_url }}');
            return ObfuscatorIO(source);
        },
        aaencode: function () {
            self.importScripts('{{ "/assets/js/vendor/cat-in-136/aadecode.js" | relative_url }}');
            return AADecode.decode(source);
        },
        jjencode: function () {
            self.importScripts('{{ "/assets/js/vendor/decoder-jjencode/jjdecode.js" | relative_url }}');
            return JJdecode.decode(source);
        },
        urlencode: function () {
            self.importScripts('{{ "/assets/js/vendor/js-beautify/unpackers/urlencode_unpacker.js" | relative_url }}');
            if (Urlencoded.detect(source)) return Urlencoded.unpack(source);
            throw 'Not matched';
        },
        p_a_c_k_e_r: function () {
            self.importScripts('{{ "/assets/js/vendor/js-beautify/unpackers/p_a_c_k_e_r_unpacker.js" | relative_url }}');
            if (P_A_C_K_E_R.detect(source)) return P_A_C_K_E_R.unpack(source);
            throw 'Not matched';
        },
        javascriptobfuscator: function () {
            self.importScripts('{{ "/assets/js/vendor/js-beautify/unpackers/javascriptobfuscator_unpacker.js" | relative_url }}');
            if (JavascriptObfuscator.detect(source)) return JavascriptObfuscator.unpack(source);
            throw 'Not matched';
        },
        myobfuscate: function () {
            self.importScripts('{{ "/assets/js/vendor/js-beautify/unpackers/myobfuscate_unpacker.js" | relative_url }}');
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
