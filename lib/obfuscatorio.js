/* global utils */
// eslint-disable-next-line no-unused-vars
function ObfuscatorIO(source, options) {
  const detectPattern = /((?!\d)[a-z\d_$]*)\(('|")(0x[a-f\d]+|\\x30\\x78[\\xa-f\d]+)('|")(,('|").+?('|"))?\)/;
  let _var = source.match(new RegExp(detectPattern, 'ig')),
    _code;

  if (!_var) throw 'Not matched';

  _var = _var.map((i) => i.replace(/\(.+?\)$/, ''));
  _var = _var.filter((i, pos) => _var.indexOf(i) === pos && i !== '');

  let keyStore = [];

  for (const key of _var) {
    const { sourceVar, keyVar } = getVarDefiner(key, source);
    source = sourceVar;
    keyStore = keyStore.concat(keyVar);
  }

  console.log(source, keyStore);

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

function getVarDefiner(key, source) {
  const varPattern = '\\b(var|const|let)\\s+' + key + '\\s*=\\s*((?!\\d)[a-z\\d_$]*?)(;|,)';
  const varGroupPattern = new RegExp(varPattern, 'gi');

  let keyVar = [];
  let sourceVar = source;

  if (varGroupPattern.test(source)) {
    sourceVar = source.replace(varGroupPattern, (m) => {
      const varMatch = m.match(new RegExp(varPattern, 'i'));
      keyVar.push({
        key,
        return: varMatch[2],
        code: varMatch[0].replace(/,$/, ';'),
      });

      if (m.slice(-1) === ';') return '';
      return varMatch[1] + ' ';
    });
  }

  return { sourceVar, keyVar };
}
