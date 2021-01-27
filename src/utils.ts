import {
  RouteHooksStorage,
  Match,
  Route,
  NavigateOptions,
  ResolveOptions,
  QContext,
  ResolveStrategy,
} from "../index";

import {
  PARAMETER_REGEXP,
  WILDCARD_REGEXP,
  REPLACE_VARIABLE_REGEXP,
  REPLACE_WILDCARD,
  START_BY_SLASH_REGEXP,
  MATCH_REGEXP_FLAGS,
  REPLACE_NOT_SURE,
  NOT_SURE_REGEXP,
} from "./constants";

export function getCurrentEnvURL(fallback = "/"): string {
  if (windowAvailable()) {
    return location.pathname + location.search + location.hash;
  }
  return fallback;
}
export function clean(s: string) {
  return s.replace(/\/+$/, "").replace(/^\/+/, "");
}
export function isString(s: any): boolean {
  return typeof s === "string";
}
export function isFunction(s: any): boolean {
  return typeof s === "function";
}
export function extractHashFromURL(url: string) {
  if (url && url.indexOf("#") >= 0) {
    return url.split("#").pop() || "";
  }
  return "";
}
export function regExpResultToParams(match, names: string[]) {
  if (names.length === 0) return null;
  if (!match) return null;
  return match.slice(1, match.length).reduce((params, value, index) => {
    if (params === null) params = {};
    params[names[index]] = decodeURIComponent(value);
    return params;
  }, null);
}
export function extractGETParameters(url: string) {
  const tmp = clean(url).split(/\?(.*)?$/);
  return [clean(tmp[0]), tmp.slice(1).join("")];
}
export function parseQuery(queryString: string): Object {
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
export function matchRoute(context: QContext, route: Route): false | Match {
  const [current, GETParams] = extractGETParameters(
    clean(context.currentLocationPath)
  );
  const params = GETParams === "" ? null : parseQuery(GETParams);
  const paramNames = [];
  let pattern;
  if (isString(route.path)) {
    pattern =
      START_BY_SLASH_REGEXP +
      clean(route.path as string)
        .replace(PARAMETER_REGEXP, function (full, dots, name) {
          paramNames.push(name);
          return REPLACE_VARIABLE_REGEXP;
        })
        .replace(WILDCARD_REGEXP, REPLACE_WILDCARD)
        .replace(NOT_SURE_REGEXP, REPLACE_NOT_SURE) +
      "$";
    if (clean(route.path as string) === "") {
      if (clean(current) === "") {
        return {
          url: current,
          queryString: GETParams,
          hashString: extractHashFromURL(context.to),
          route: route,
          data: null,
          params,
        };
      }
    }
  } else {
    pattern = route.path;
  }
  const regexp = new RegExp(pattern, MATCH_REGEXP_FLAGS);
  const match = current.match(regexp);
  // console.log(current, regexp);
  if (match) {
    const data = isString(route.path)
      ? regExpResultToParams(match, paramNames)
      : match.slice(1);
    return {
      url: current,
      queryString: GETParams,
      hashString: extractHashFromURL(context.to),
      route: route,
      data,
      params,
    };
  }
  return false;
}
export function pushStateAvailable(): boolean {
  return !!(
    typeof window !== "undefined" &&
    window.history &&
    window.history.pushState
  );
}
export function undefinedOrTrue(obj, key: string): boolean {
  return typeof obj[key] === "undefined" || obj[key] === true;
}
export function parseNavigateOptions(source?: string): NavigateOptions {
  if (!source) return {};
  const pairs = source.split(",");
  const options: NavigateOptions = {};
  let resolveOptions: ResolveOptions;

  pairs.forEach((str) => {
    const temp = str.split(":").map((v) => v.replace(/(^ +| +$)/g, ""));
    switch (temp[0]) {
      case "historyAPIMethod":
        options.historyAPIMethod = temp[1];
        break;
      case "resolveOptionsStrategy":
        if (!resolveOptions) resolveOptions = {};
        resolveOptions.strategy = temp[1] as ResolveStrategy;
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
export function accumulateHooks(
  hooks = [],
  result: RouteHooksStorage = {}
): RouteHooksStorage {
  hooks
    .filter((h) => h)
    .forEach((h) => {
      ["before", "after", "already", "leave"].forEach((type) => {
        if (h[type]) {
          if (!result[type]) result[type] = [];
          result[type].push(h[type]);
        }
      });
    });
  return result as RouteHooksStorage;
}
