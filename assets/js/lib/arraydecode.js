/* global utils */
// eslint-disable-next-line no-unused-vars
function ArrayDecode(source) {
    var detectPattern = /^var\s+((?!\d)[a-z_\d$]*)\s*=\s*\[.*?\];/,
        _var = source.match(detectPattern);

    if (!_var || _var.length !== 2) throw 'Not matched';

    var _name = _var[1],
        _code = source.replace(detectPattern, ''),
        keyPattern = new RegExp(_name.replace(/\$/g, '\\$') + '\\[(\\d+)\\]', 'g');

    _var = _var[0].replace(/[\s\S]*?\[/, '[');
    _var = eval(_var);

    _code = _code.split(';');
    _code = _code.map(function (piece) {
        piece.replace(keyPattern, function (key, index) {
            var item = _var[index],
                q = utils.strWrap(item);

            piece = piece.replace(key, q + utils.escapeRegExp(item, q) + q);

            return piece;
        });

        return piece;
    });
    _code = _code.join(';');

    _code = utils.strMerge(_code);
    _code = utils.methodChain(_code);

    return _code;
}
