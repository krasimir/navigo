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
  var result = {
    fullURL: clean(url),
    params: null
  };
  var matches = patterns
    .map(p => {
      let paramNames = [];
      p = p.replace(PARAMETER_REGEXP, function (full, dots, name) {
        paramNames.push(name);
        return REPLACE_VARIABLE_REGEXP;
      });
      let match = url.match(new RegExp(clean(p)));
      return { 
        regExpResult: match,
        params: urlToParams(paramNames, match)
      }
    })
    .filter(m => m.regExpResult !== null);

  if (matches.length === 0) {
    return result;
  }

  let match = matches.shift();
  result.fullURL = clean(result.fullURL.substr(0, match.regExpResult.index));
  result.params = match.params;

  return result;
};
