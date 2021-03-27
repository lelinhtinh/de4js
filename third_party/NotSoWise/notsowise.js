// eslint-disable-next-line no-unused-vars
function NotSoWise(code) {
  function analyze() {
    var flag0 = code.startsWith('//Protected by WiseLoop PHP JavaScript Obfuscator');
    var flag1 = code.includes(';eval(function(w,i,s,e)');
    return flag0 || flag1;
  }

  function post() {
    var flag0 = code.includes('window.location.hostname.replace("www.","")');
    var flag1 = code.includes("throw new Error('');");
    return flag0 && flag1;
  }

  if (!analyze()) throw 'Not matched';

  code = code.substring(code.indexOf('\n')).trim();
  code = eval('(' + code.substring(';eval'.length).replace(");}('", ");})('"));
  code = eval('(' + code.substring(';eval'.length).replace(");}('", ");})('"));
  code = eval('(' + code.substring(code.indexOf('; ;eval') + '; ;eval'.length).replace(");}('", ");})('"));

  if (post()) {
    code = code.substring(code.indexOf(");}throw new Error('');}") + ");}throw new Error('');}".length);
  }

  return code;
}
