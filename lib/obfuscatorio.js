/* global utils */
// eslint-disable-next-line no-unused-vars
function ObfuscatorIO(source, options) {
  const detectPattern = /((?!\d)[a-z\d_$]*)\(-?('|")(0x[a-f\d]+|\\x30\\x78[\\xa-f\d]+)('|")(,('|").+?('|"))?\)/,
    detectMatch = new RegExp(detectPattern, 'gi');

  let _var = source.match(detectMatch),
    _code;

  if (!_var) throw 'Not matched';

  _var = _var.map((i) => i.replace(/\(.+?\)$/, ''));
  _var = _var.filter((i, pos) => _var.indexOf(i) === pos && i !== '');

  let keyStore = [];

  for (const key of _var) {
    const { sourceVar, keyVar } = getVarDefiner(key, source);
    source = sourceVar;
    keyStore = keyStore.concat(keyVar);

    const { sourceFunc, keyFunc } = getFuncDefiner(key, source);
    source = sourceFunc;
    keyStore = keyStore.concat(keyFunc);
  }

  const sourceSize = source.length;

  if (!keyStore.length) throw 'Key not found';

  let bodyVar = '',
    headVar = {};
  for (const obj of keyStore) {
    bodyVar += obj.code;
    const returnIndex = source.search(
      new RegExp('\\b(var|const|let)\\s+' + obj.return + '\\s*=\\s*function\\s*\\(.*?\\)\\s*', 'i'),
    );
    if (returnIndex !== -1) {
      headVar[obj.return] = returnIndex;
    }
  }

  if (Object.keys(headVar).length !== 1) throw 'sanex3339';

  let pos = Object.values(headVar)[0],
    bo = 0,
    bc = 0;

  const splitSource = (pos) => {
    headVar = source.slice(0, pos);
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

  _var = headVar + bodyVar;
  _var = _var.replace(/\b(const|let)(\s*(?!\d)[a-z\d_$]*=)/gi, 'var $2');
  eval(_var);

  _code = _code.split(';');
  _code = _code.map((piece) => {
    piece = piece.replace(detectMatch, (key) => {
      const item = eval(key),
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

function getFuncDefiner(key, source) {
  const funcPattern = '\\b(var|const|let)\\s+' + key + '\\s*=\\s*function\\s*\\(.*?\\)\\s*';
  const funcGroupPattern = new RegExp(funcPattern, 'gi');

  let keyFunc = [];
  let sourceFunc = source;

  while (funcGroupPattern.test(source)) {
    const varIndex = source.search(new RegExp(funcPattern, 'i')),
      sourceSize = source.length;

    if (varIndex === -1) throw 'Not found';

    let pos = varIndex,
      bo = 0,
      bc = 0;

    const splitSource = (pos) => {
      sourceFunc = source.slice(0, varIndex) + source.slice(pos);
      const varFunc = source.slice(varIndex, pos);
      const returnMatch = varFunc.match(/(return\s+((?!\d)[a-z\d_$]*))(?![\s\S]*return)/i);
      keyFunc.push({
        key,
        return: returnMatch[2],
        code: varFunc,
      });

      source = sourceFunc;
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
  }

  return { sourceFunc, keyFunc };
}
