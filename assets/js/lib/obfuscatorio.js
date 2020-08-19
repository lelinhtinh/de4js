/* global utils */
// eslint-disable-next-line no-unused-vars
function ObfuscatorIO(source, options) {
  const detectPattern = /((?!\d)[a-z\d_$]*)\s*\(\s*('|")(0x[a-f\d]+|\\x30\\x78[\\xa-f\d]+)('|")(\s*,\s*('|").+?('|"))?\s*\)/;
  let _var = source.match(new RegExp(detectPattern, 'i')),
    _code;

  if (!_var) throw 'Not matched';

  const _name = _var[1],
    varIndex = source.search(new RegExp('\\b(var|const|let)\\s+' + _name + '\\s*=\\s*')),
    sourceSize = source.length;

  if (varIndex === -1) throw 'Not found';

  let pos = varIndex,
    bo = 0,
    bc = 0;

  const splitSource = (pos) => {
    eval(source.slice(0, pos));
    _var = eval(_name);
    _code = source.slice(pos);
  };

  while (pos < sourceSize) {
    if (source.charAt(pos) === '{') bo++;
    if (source.charAt(pos) === '}') bc++;
    if (bc === bo && bo !== 0) {
      splitSource(pos + 2);
      break;
    }
    pos++;
  }

  if (!_code) throw 'Not splits';

  _code = _code.split(';');
  _code = _code.map((piece) => {
    piece = piece.replace(new RegExp(detectPattern, 'gi'), (key) => {
      const item = eval(key.replace(_name, '_var')),
        q = utils.strWrap(item);
      return q + utils.escapeRegExp(item, q) + q;
    });

    if (options.calc) piece = utils.calcHex(piece);
    if (options._unescape) piece = utils._unescape(piece);
    piece = utils._boolean(piece);
    piece = utils.propArr(piece);

    return piece;
  });
  _code = _code.join(';');

  if (options.calc) _code = utils.calcNumber(_code);
  _code = utils.strMerge(_code);
  if (options.methodChain) _code = utils.methodChain(_code);

  return _code;
}
