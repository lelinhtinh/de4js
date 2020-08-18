/* eslint-disable no-unused-vars */
var utils = {
  strWrap: (str) => {
    if (str.includes('\n') || (str.includes('"') && str.includes("'"))) return '`';
    return !str.includes("'") ? "'" : '"';
  },

  escapeRegExp: (str, q) => {
    return str.replace(new RegExp(`[\\\\${q}\\n]`, 'g'), '\\$&').replace(/-/g, '\\x2d');
  },

  strMerge: (str) => {
    return str.replace(/'\s*\+\s*'|"\s*\+\s*"/g, '');
  },

  methodChain: (str) => {
    return str.replace(/(?<!\()\[("|')((?!\d)[a-z_\d$]*)("|')\]/gi, '.$2 ');
  },

  calc: (str) => {
    return str.replace(/(?<!('|"))([+\-*/]*(?<!\w)0x[a-f\d]+[+\-*/]*)+(?!('|"))/gi, (m) => eval(m));
  },
};
