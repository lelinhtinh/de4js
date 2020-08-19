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

self.addEventListener('message', (e) => {
  let source = e.data.source;
  const packer = e.data.packer;
  const options = e.data.options;

  const methods = {
    evalencode: () => {
      self.importScripts('{{ "/assets/js/lib/evaldecode.js" | relative_url }}');
      return EvalDecode(source);
    },
    _numberencode: () => {
      self.importScripts('{{ "/assets/js/lib/numberdecode.js" | relative_url }}');
      return _NumberDecode(source);
    },
    arrayencode: () => {
      self.importScripts('{{ "/assets/js/lib/utils.js" | relative_url }}');
      self.importScripts('{{ "/assets/js/lib/arraydecode.js" | relative_url }}');
      return ArrayDecode(source, options);
    },
    jsfuck: () => {
      self.importScripts('{{ "/assets/js/lib/jsfuckdecode.js" | relative_url }}');
      return JSFuckDecode(source);
    },
    obfuscatorio: () => {
      self.importScripts('{{ "/assets/js/vendor/mathjs/math.min.js" | relative_url }}');
      self.importScripts('{{ "/assets/js/lib/utils.js" | relative_url }}');
      self.importScripts('{{ "/assets/js/lib/obfuscatorio.js" | relative_url }}');
      return ObfuscatorIO(source, options);
    },
    aaencode: () => {
      self.importScripts('{{ "/assets/js/vendor/cat-in-136/aadecode.js" | relative_url }}');
      return AADecode.decode(source);
    },
    jjencode: () => {
      self.importScripts('{{ "/assets/js/vendor/decoder-jjencode/jjdecode.js" | relative_url }}');
      return JJdecode.decode(source);
    },
    urlencode: () => {
      self.importScripts('{{ "/assets/js/vendor/js-beautify/unpackers/urlencode_unpacker.js" | relative_url }}');
      if (Urlencoded.detect(source)) return Urlencoded.unpack(source);
      throw 'Not matched';
    },
    p_a_c_k_e_r: () => {
      self.importScripts('{{ "/assets/js/vendor/js-beautify/unpackers/p_a_c_k_e_r_unpacker.js" | relative_url }}');
      if (P_A_C_K_E_R.detect(source)) return P_A_C_K_E_R.unpack(source);
      throw 'Not matched';
    },
    javascriptobfuscator: () => {
      self.importScripts(
        '{{ "/assets/js/vendor/js-beautify/unpackers/javascriptobfuscator_unpacker.js" | relative_url }}',
      );
      if (JavascriptObfuscator.detect(source)) return JavascriptObfuscator.unpack(source);
      throw 'Not matched';
    },
    myobfuscate: () => {
      self.importScripts('{{ "/assets/js/vendor/js-beautify/unpackers/myobfuscate_unpacker.js" | relative_url }}');
      if (MyObfuscate.detect(source)) return MyObfuscate.unpack(source);
      throw 'Not matched';
    },
  };

  try {
    source = methods[packer]();
  } catch (err) {
    console.error(err);
  }

  self.postMessage(source);
});
