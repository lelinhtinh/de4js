// eslint-disable-next-line no-unused-vars
function EvalDecode(source) {
    self._eval = self.eval;

    self.eval = function (_evalsource) {
        return _evalsource;
    };

    setTimeout(function () {
        self.eval = self._eval;
    }, 0);

    return self._eval(source);
}
