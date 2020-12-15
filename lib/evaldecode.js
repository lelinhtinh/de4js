/* global utils */
// eslint-disable-next-line no-unused-vars
function EvalDecode(source, options) {
  self._eval = self.eval;

  self.eval = (_code) => {
    self.eval = self._eval;

    _code = _code.split(';');
    _code = _code.map((piece) => {
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
    _code = utils.cleanGrouping(_code);

    return _code;
  };

  return self._eval(source);
}
