// 0874cae | https://raw.githubusercontent.com/enkhee-Osiris/Decoder-JSFuck/master/index.html

var JSFuckDecode = {
    patternCreator: function (prefix, postfix) {
        replacedPrefix = prefix.replace(/[\[\]\(\)\+\!]/g, '\\$&');
        replacedPostfix = postfix.replace(/[\[\]\(\)\+\!]/g, '\\$&');

        return replacedPrefix + '(.*)' + replacedPostfix;
    },

    isMatching: function (string, pattern) {
        var result = string.match(new RegExp(pattern));

        if (result) return result[1];

        return null;
    },

    setDecoded: function (decodedCode) {
        return eval(decodedCode);
    },

    decode: function (text) {
        var prefix = '[][' + JSFuck.encode('fill') + ']' +
            '[' + JSFuck.encode('constructor') + ']' +
            '(' + JSFuck.encode('return eval') + ')()(';
        var postfix = ')';
        var result = JSFuckDecode.isMatching(text, JSFuckDecode.patternCreator(prefix, postfix));

        if (result) return JSFuckDecode.setDecoded(result);

        prefix = '[][' + JSFuck.encode('fill') + ']' +
            '[' + JSFuck.encode('constructor') + '](';
        postfix = ')()';
        result = JSFuckDecode.isMatching(text, JSFuckDecode.patternCreator(prefix, postfix));

        if (result) return JSFuckDecode.setDecoded(result);

        prefix = '[][' + JSFuck.encode('filter') + ']' +
            '[' + JSFuck.encode('constructor') + '](';
        postfix = ')()';
        result = JSFuckDecode.isMatching(text, JSFuckDecode.patternCreator(prefix, postfix));

        if (result) return JSFuckDecode.setDecoded(result);

        return JSFuckDecode.setDecoded(text);
    }
}
