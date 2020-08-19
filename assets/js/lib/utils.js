/* global math */
/* eslint-disable no-unused-vars */
var utils = {
  strWrap: (str) => {
    if (str.includes('\n') || (str.includes('"') && str.includes("'"))) return '`';
    return !str.includes("'") ? "'" : '"';
  },

  escapeRegExp: (str, q) => str.replace(new RegExp(`[\\\\${q}\\n]`, 'g'), '\\$&').replace(/-/g, '\\x2d'),

  _unescape: (str) => {
    for (let i = 32; i < 128; i++) {
      str = str.replace(new RegExp('\\\\x' + i.toString(16), 'ig'), String.fromCharCode(i));
    }
    str = str.replace(/\\x09/g, '\t');
    return str;
  },

  strMerge: (str) => str.replace(/'\s*\+\s*'|"\s*\+\s*"/g, ''),

  methodChain: (str) => str.replace(/(?<!\()\[("|')((?!\d)[a-z_\d$]*)("|')\]/gi, '.$2 '),

  calcHex: (str) => {
    str = str.replace(/(?<!['"])(?<!\w)0x[a-f\d]+((?<!\w)0x[a-f\d]+|[+\-*/])*(?<!\w)0x[a-f\d]+(?!['"])/gi, (m) =>
      math.format(eval(m), 14),
    );
    str = str.replace(/(?<!['"])(?<!\w)0x[a-f\d]+(?!['"])/gi, (m) => eval(m));
    return str;
  },

  calcNumber: (str) => {
    str = str.replace(/\(([\d.]+)\)/g, '$1');
    str = str.replace(/(?<!['"\w])\d[+\-*/\d.]*\d(?!['"\w])/g, (m) => {
      if (!/[+\-*/]/.test(m)) return m;
      return math.format(math.evaluate(m), 14);
    });
    return str;
  },

  _boolean: (str) => str.replace(/((?<=([=:(,|&[]|return|=>))|^)!{1,2}(\[\]|0|1)((?=[;,)}|&\]])|$)/g, (m) => eval(m).toString()),

  propArr: (str) => str.replace(/\[\((['"])((?!\d)[a-z_\d$]*)['"]\)\]/gi, '[$1$2$1]'),
};
