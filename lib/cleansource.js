/* global utils */
// eslint-disable-next-line no-unused-vars
function CleanSource(source, options) {
  var _code = source;

  _code = _code.split(';');
  _code = _code.map((piece) => {
    if (options.calc) piece = utils.calcHex(piece);
    if (options._unescape) piece = utils._unescape(piece);
    piece = utils.toBool(piece);
    piece = utils.propArr(piece);

    return piece;
  });
  _code = _code.join(';');

  if (options.strMerge) _code = utils.strMerge(_code);
  if (options.calc) _code = utils.calcNumber(_code);
  if (options.methodChain) _code = utils.methodChain(_code);
  if (options.removeGrouping) _code = utils.removeGrouping(_code);

  return _code;
}
