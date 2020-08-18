/* eslint-disable no-unused-vars */
var utils = {
    strWrap: function (str) {
        if (str.includes('\n') || (str.includes('"') && str.includes("'"))) return '`';
        return !str.includes("'") ? "'" : '"';
    },

    escapeRegExp: function (str, q) {
        return str.replace(new RegExp('[\\n*+?^${}()|[\\]\\\\' + q + ']', 'g'), '\\$&');
    },

    strMerge: function (str) {
        return str.replace(/'\s*\+\s*'|"\s*\+\s*"/g, '');
    },

    methodChain: function (str) {
        return str.replace(/(?<!\()\[("|')((?!\d)[a-z_\d$]*)("|')\]/gi, '.$2 ');
    }
};
