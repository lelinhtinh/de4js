// eslint-disable-next-line no-unused-vars
function _NumberDecode(source) {
  const detectPattern = /_\d{4}\((_\d{4})\);\}/;
  let _code = source;

  if (!detectPattern.test(_code)) throw 'Not matched';

  _code = _code.replace(/var\s/g, 'this.');
  _code = _code.replace(/function\s(_\d{4})\(/, 'this.$1=function(');
  _code = _code.replace(detectPattern, 'self.underscoreNumberSource=$1;};');

  _code = '(function(){' + _code + '})();';
  eval(_code);

  return self.underscoreNumberSource;
}
