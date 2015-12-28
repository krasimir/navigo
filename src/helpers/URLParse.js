const PARAMETER_REGEXP = /([:*])(\w+)/g;
const REPLACE_VARIABLE_REGEXP = '([^\/]+)';

const clean = function (s) {
  return s.replace(/\/$/, '').replace(/^\//, '');
};

const urlToParams = function (names, match) {
  if (names.length === 0) return null;
  if (!match) return null;
  return match
    .slice(1, match.length)
    .reduce((params, value, index) => {
      params[names[index]] = value;
      return params;
    }, {});
};

export function parse(url, patterns = []) {
  let defaultResult = {
    params: null,
    fullURL: clean(url),
    index: null
  }
  return patterns
    .map((p, index) => {
      let paramNames = [];
      p = p.replace(PARAMETER_REGEXP, function (full, dots, name) {
        paramNames.push(name);
        return REPLACE_VARIABLE_REGEXP;
      });
      let match = url.match(new RegExp(clean(p)));
      return match ? {
        params: urlToParams(paramNames, match),
        fullURL: match ? clean(url.substr(0, match.index)) : defaultResult.fullURL,
        index
      } : false;
    })
    .filter(m => m)[0] || defaultResult;
};
