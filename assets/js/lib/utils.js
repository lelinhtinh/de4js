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

  calc: (str) =>
    str.replace(/(?<!('|"))([+\-*/]*(?<!\w)0x[a-f\d]+[+\-*/]*)+(?!('|"))/gi, (m) => {
      const notChain = m.match(/^(([+\-*/]+)((?<!\w)0x[a-f\d]+)|((?<!\w)0x[a-f\d]+)([+\-*/]+))$/i);
      if (!notChain) return eval(m);
      if (notChain[3]) return notChain[2] + eval(notChain[3]);
      return eval(notChain[4]) + notChain[5];
    }),
};
