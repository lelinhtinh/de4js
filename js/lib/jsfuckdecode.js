// eslint-disable-next-line no-unused-vars
function JSFuckDecode(source) {
  const detectPattern = /\)(\(\)[\s\n]*)$/,
    anonPattern = /^[\s\n]*function\sanonymous\([\s\n]+\)\s\{[\s\n]+/;
  let _code = source;

  if (detectPattern.test(source)) _code = _code.replace(detectPattern, ')');
  _code = eval(_code + '.toString()');

  if (anonPattern.test(_code)) {
    _code = _code.replace(anonPattern, '');
    _code = _code.replace(/[\s\n]+\}[\s\n]*$/, '');
  }

  return _code;
}
