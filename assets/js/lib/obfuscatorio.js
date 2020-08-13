/* global utils */
// eslint-disable-next-line no-unused-vars
function ObfuscatorIO(source) {
    var detectPattern = /((?!\d)[a-z\d_$]*)\s*\(\s*('|")(0x[a-f\d]+|\\x30\\x78[\\xa-f\d]+)('|")(\s*,\s*('|").+?('|"))?\s*\)/,
        _var = source.match(new RegExp(detectPattern, 'i')),
        _code;

    if (!_var) throw 'Not matched';

    var _name = _var[1],
        varPattern = '\\bvar\\s+' + _name + '\\s*=\\s*',
        varIndex = source.search(new RegExp(varPattern)),
        sourceSize = source.length;

    if (varIndex === -1) throw 'Not found';

    var pos = varIndex,
        bo = 0,
        bc = 0,
        splitSource = function (pos) {
            eval(source.slice(0, pos + 1));
            _var = eval(_name);
            _code = source.slice(pos + 1);
        },
        isArrVar = (new RegExp(varPattern + '\\[')).test(source);

    while (pos < sourceSize) {
        if (isArrVar) {
            if (source.charAt(pos) === ';') {
                splitSource(pos + 1);
                break;
            }
        } else {
            if (source.charAt(pos) === '{') bo++;
            if (source.charAt(pos) === '}') bc++;
            if (bc === bo && bo !== 0) {
                splitSource(pos + 1);
                break;
            }
        }
        pos++;
    }
    if (!_code) throw 'Not splits';

    _code = _code.split(';');
    _code = _code.map(function (piece) {
        piece.replace(new RegExp(detectPattern, 'gi'), function (key) {
            var item = eval(key.replace(_name, '_var')),
                q = utils.strWrap(item);
            piece = piece.replace(key, q + utils.escapeRegExp(item, q) + q);
            return piece;
        });

        piece.replace(/(?<!('|"))0x[a-f\d]+/gi, (m) => {
            piece = piece.replace(m, eval(m));
            return piece;
        });

        return piece;
    });
    _code = _code.join(';');

    _code = utils.strMerge(_code);
    _code = utils.methodChain(_code);

    return _code;
}
