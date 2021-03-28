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

/* globals EvalDecode, ArrayDecode, _NumberDecode, JSFuckDecode, ObfuscatorIO, CleanSource, AADecode, JJdecode, Urlencoded, P_A_C_K_E_R, JavascriptObfuscator, MyObfuscate, Wise_EvalDecode, Wise_FunctionalDecode */
/* eslint-disable no-console */

self.addEventListener('message', (e) => {
  self.importScripts('{{ "third_party/mathjs/math.min.js" | relative_url }}');
  self.importScripts('{{ "lib/utils.js" | relative_url }}');

  let source = e.data.source;
  const packer = e.data.packer;
  const options = e.data.options;

  const methods = {
    evalencode: () => {
      self.importScripts('{{ "lib/evaldecode.js" | relative_url }}');
      return EvalDecode(source);
    },
    _numberencode: () => {
      self.importScripts('{{ "lib/numberdecode.js" | relative_url }}');
      return _NumberDecode(source);
    },
    arrayencode: () => {
      self.importScripts('{{ "lib/arraydecode.js" | relative_url }}');
      return ArrayDecode(source, options);
    },
    jsfuck: () => {
      self.importScripts('{{ "lib/jsfuckdecode.js" | relative_url }}');
      return JSFuckDecode(source);
    },
    obfuscatorio: () => {
      self.importScripts('{{ "lib/obfuscatorio.js" | relative_url }}');
      return ObfuscatorIO(source, options);
    },
    cleansource: () => {
      self.importScripts('{{ "lib/cleansource.js" | relative_url }}');
      return CleanSource(source, options);
    },
    aaencode: () => {
      self.importScripts('{{ "third_party/cat-in-136/aadecode.js" | relative_url }}');
      return AADecode.decode(source);
    },
    jjencode: () => {
      self.importScripts('{{ "third_party/decoder-jjencode/jjdecode.js" | relative_url }}');
      return JJdecode.decode(source);
    },
    urlencode: () => {
      self.importScripts('{{ "third_party/js-beautify/unpackers/urlencode_unpacker.js" | relative_url }}');
      if (Urlencoded.detect(source)) return Urlencoded.unpack(source);
      throw 'Not matched';
    },
    p_a_c_k_e_r: () => {
      self.importScripts('{{ "third_party/js-beautify/unpackers/p_a_c_k_e_r_unpacker.js" | relative_url }}');
      if (P_A_C_K_E_R.detect(source)) return P_A_C_K_E_R.unpack(source);
      throw 'Not matched';
    },
    javascriptobfuscator: () => {
      self.importScripts('{{ "third_party/js-beautify/unpackers/javascriptobfuscator_unpacker.js" | relative_url }}');
      if (JavascriptObfuscator.detect(source)) return JavascriptObfuscator.unpack(source);
      throw 'Not matched';
    },
    myobfuscate: () => {
      self.importScripts('{{ "third_party/js-beautify/unpackers/myobfuscate_unpacker.js" | relative_url }}');
      if (MyObfuscate.detect(source)) return MyObfuscate.unpack(source);
      throw 'Not matched';
    },
    wiseeval: () => {
      self.importScripts('{{ "third_party/NotSoWise/unpacker.js" | relative_url }}');
      return Wise_EvalDecode(source);
    },
    wisefunction: () => {
      self.importScripts('{{ "third_party/NotSoWise/unpacker.js" | relative_url }}');
      return Wise_FunctionalDecode(source);
    },
  };

  try {
    source = methods[packer]();
  } catch (err) {
    throw new Error(err);
  }

  self.postMessage(source);
});
