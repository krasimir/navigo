import { PARAMETER_REGEXP, WILDCARD_REGEXP, REPLACE_VARIABLE_REGEXP, REPLACE_WILDCARD, START_BY_SLASH_REGEXP, MATCH_REGEXP_FLAGS, REPLACE_NOT_SURE, NOT_SURE_REGEXP } from "./constants";
export function getCurrentEnvURL(fallback) {
  if (fallback === void 0) {
    fallback = "/";
  }

  if (windowAvailable()) {
    return location.pathname + location.search + location.hash;
  }

  return fallback;
}
export function clean(s) {
  return s.replace(/\/+$/, "").replace(/^\/+/, "");
}
export function isString(s) {
  return typeof s === "string";
}
export function isFunction(s) {
  return typeof s === "function";
}
export function extractHashFromURL(url) {
  if (url && url.indexOf("#") >= 0) {
    return url.split("#").pop() || "";
  }

  return "";
}
export function regExpResultToParams(match, names) {
  if (names.length === 0) return null;
  if (!match) return null;
  return match.slice(1, match.length).reduce(function (params, value, index) {
    if (params === null) params = {};
    params[names[index]] = decodeURIComponent(value);
    return params;
  }, null);
}
export function extractGETParameters(url) {
  var tmp = clean(url).split(/\?(.*)?$/);
  return [clean(tmp[0]), tmp.slice(1).join("")];
}
export function parseQuery(queryString) {
  var query = {};
  var pairs = queryString.split("&");

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split("=");

    if (pair[0] !== "") {
      var key = decodeURIComponent(pair[0]);

      if (!query[key]) {
        query[key] = decodeURIComponent(pair[1] || "");
      } else {
        if (!Array.isArray(query[key])) query[key] = [query[key]];
        query[key].push(decodeURIComponent(pair[1] || ""));
      }
    }
  }

  return query;
}
export function matchRoute(context, route) {
  var _extractGETParameters = extractGETParameters(clean(context.currentLocationPath)),
      current = _extractGETParameters[0],
      GETParams = _extractGETParameters[1];

  var params = GETParams === "" ? null : parseQuery(GETParams);
  var paramNames = [];
  var pattern;

  if (isString(route.path)) {
    pattern = START_BY_SLASH_REGEXP + clean(route.path).replace(PARAMETER_REGEXP, function (full, dots, name) {
      paramNames.push(name);
      return REPLACE_VARIABLE_REGEXP;
    }).replace(WILDCARD_REGEXP, REPLACE_WILDCARD).replace(NOT_SURE_REGEXP, REPLACE_NOT_SURE) + "$";

    if (clean(route.path) === "") {
      if (clean(current) === "") {
        return {
          url: current,
          queryString: GETParams,
          hashString: extractHashFromURL(context.to),
          route: route,
          data: null,
          params: params
        };
      }
    }
  } else {
    pattern = route.path;
  }

  var regexp = new RegExp(pattern, MATCH_REGEXP_FLAGS);
  var match = current.match(regexp);

  if (match) {
    var data = isString(route.path) ? regExpResultToParams(match, paramNames) : match.groups ? match.groups : match.slice(1);
    return {
      url: clean(current.replace(new RegExp("^" + context.instance.root), "")),
      queryString: GETParams,
      hashString: extractHashFromURL(context.to),
      route: route,
      data: data,
      params: params
    };
  }

  return false;
}
export function pushStateAvailable() {
  return !!(typeof window !== "undefined" && window.history && window.history.pushState);
}
export function undefinedOrTrue(obj, key) {
  return typeof obj[key] === "undefined" || obj[key] === true;
}
export function parseNavigateOptions(source) {
  if (!source) return {};
  var pairs = source.split(",");
  var options = {};
  var resolveOptions;
  pairs.forEach(function (str) {
    var temp = str.split(":").map(function (v) {
      return v.replace(/(^ +| +$)/g, "");
    });

    switch (temp[0]) {
      case "historyAPIMethod":
        options.historyAPIMethod = temp[1];
        break;

      case "resolveOptionsStrategy":
        if (!resolveOptions) resolveOptions = {};
        resolveOptions.strategy = temp[1];
        break;

      case "resolveOptionsHash":
        if (!resolveOptions) resolveOptions = {};
        resolveOptions.hash = temp[1] === "true";
        break;

      case "updateBrowserURL":
      case "callHandler":
      case "updateState":
      case "force":
        options[temp[0]] = temp[1] === "true";
        break;
    }
  });

  if (resolveOptions) {
    options.resolveOptions = resolveOptions;
  }

  return options;
}
export function windowAvailable() {
  return typeof window !== "undefined";
}
export function accumulateHooks(hooks, result) {
  if (hooks === void 0) {
    hooks = [];
  }

  if (result === void 0) {
    result = {};
  }

  hooks.filter(function (h) {
    return h;
  }).forEach(function (h) {
    ["before", "after", "already", "leave"].forEach(function (type) {
      if (h[type]) {
        if (!result[type]) result[type] = [];
        result[type].push(h[type]);
      }
    });
  });
  return result;
}