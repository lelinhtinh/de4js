// eslint-disable-next-line no-unused-vars
function EvalDecode(source) {
  self._eval = self.eval;

  self.eval = (_code) => {
    return _code;
  };

  setTimeout(() => {
    self.eval = self._eval;
  }, 0);

  return self._eval(source);
}
