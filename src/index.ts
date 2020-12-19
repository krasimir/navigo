type Route = {
  path: string;
  handler: Function;
};
type Match = {
  data: Object | null;
  params: Object | null;
};

const PARAMETER_REGEXP = /([:*])(\w+)/g;
const WILDCARD_REGEXP = /\*/g;
const REPLACE_VARIABLE_REGEXP = "([^/]+)";
const REPLACE_WILDCARD = "(?:.*)";
const FOLLOWED_BY_SLASH_REGEXP = "(?:/$|$)";
const MATCH_REGEXP_FLAGS = "";

function clean(s: string) {
  return s.replace(/\/+$/, "").replace(/^\/+/, "");
}
function regExpResultToParams(match, names: string[]) {
  if (names.length === 0) return null;
  if (!match) return null;
  return match.slice(1, match.length).reduce((params, value, index) => {
    if (params === null) params = {};
    params[names[index]] = decodeURIComponent(value);
    return params;
  }, null);
}
function extractGETParameters(url: string) {
  const tmp = url.split(/\?(.*)?$/);
  return [tmp[0], tmp.slice(1).join("")];
}
function parseQuery(queryString: string): Object {
  var query = {};
  var pairs = queryString.split("&");
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split("=");
    if (pair[0] !== "") {
      let key = decodeURIComponent(pair[0]);
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
function matchRoute(currentPath: string, route: Route): false | Match {
  const [current, GETParams] = extractGETParameters(clean(currentPath));
  const paramNames = [];
  const regexp = new RegExp(
    clean(route.path)
      .replace(PARAMETER_REGEXP, function (full, dots, name) {
        paramNames.push(name);
        return REPLACE_VARIABLE_REGEXP;
      })
      .replace(WILDCARD_REGEXP, REPLACE_WILDCARD) + FOLLOWED_BY_SLASH_REGEXP,
    MATCH_REGEXP_FLAGS
  );
  const match = current.match(regexp);
  if (match) {
    return {
      data: regExpResultToParams(match, paramNames),
      params: GETParams === "" ? null : parseQuery(GETParams),
    };
  }
  return false;
}

export default function Navigo(r?: string) {
  let root: string = "/";
  const routes: Route[] = [];

  if (!r) {
    console.warn(
      'Navigo requires a root path in its constructor. If not provided will use "/" as default.'
    );
  } else {
    root = r;
  }

  function on(path: string | Function | Object, handler?: Function) {
    if (typeof path === "object") {
      Object.keys(path).forEach((p) => this.on(p, path[p]));
      return this;
    } else if (typeof handler === "undefined") {
      handler = path as Function;
      path = root;
    }
    routes.push({ path: clean(path as string), handler });
    return this;
  }
  function resolve(currentLocationPath?: string) {
    if (typeof currentLocationPath !== "undefined") {
      if (typeof window !== "undefined") {
        currentLocationPath = clean(window.location.href);
      } else {
        currentLocationPath = root;
      }
    }
  }

  this.routes = routes;
  this.on = on;
  this.resolve = resolve;
  this._matchRoute = matchRoute;
  this._clean = clean;
}
