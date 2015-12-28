const PARAMETER_REGEXP = /([:*])(\w+)/g;
const REPLACE_VARIABLE_REGEXP = '([^\/]+)';
const FOLLOWED_BY_SLASH_REGEXP = '(?:\/|$)';

var regExpResultToParams = function (match, names) {
  if (names.length === 0) return null;
  if (!match) return null;
  return match
    .slice(1, match.length)
    .reduce((params, value, index) => {
      if (params === null) params = {};
      params[names[index]] = value;
      return params;
    }, null);
};

var replaceDynamicURLParts = function (route) {
  var paramNames = [], regexp;

  regexp = clean(route).replace(PARAMETER_REGEXP, function (full, dots, name) {
    paramNames.push(name);
    return REPLACE_VARIABLE_REGEXP;
  }) + FOLLOWED_BY_SLASH_REGEXP;
  return { 
    regexp: new RegExp(clean(regexp)),
    paramNames
  };
};

var findMatchedRoutes = function (url, routes = []) {
  return routes
    .map(route => {
      var { regexp, paramNames } = replaceDynamicURLParts(route.route);
      var match = url.match(regexp);
      var params = regExpResultToParams(match, paramNames);

      return match ? { match, route, params } : false;
    })
    .filter(m => m);
};

export function clean(s) {
  return s.replace(/\/+$/, '').replace(/^\/+/, '/');
};

export function match(url, routes = []) {
  return findMatchedRoutes(url, routes)[0] || false;
};

export function root(url, routes = []) {
  var matched = findMatchedRoutes(url, routes);
  var fallbackURL = clean(url);

  if (matched.length > 0) {
    return matched
      .map(m => clean(url.substr(0, m.match.index)))
      .reduce((root, current) => {
        return current.length < root.length ? current : root;
      }, fallbackURL);
  }
  return fallbackURL;
};
