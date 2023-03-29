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

export function getCurrentURLPath(fallback = "/"): string {
  return window?.location?.pathname + window?.location?.search + window?.location?.hash ?? fallback;
}
export function clean(s: string): string {
  return s.replace(/^\/+|\/+$/g, "$1");
}
export function isString(s: any): boolean {
  return typeof s === "string" || s instanceof String;
}
export function isFunction(s: any): boolean {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Function]";
}
export function extractHashFromURL(url: string): string {
  const match = /#(.*)$/.exec(url);
  return match ? match[1] : "";
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
  const params: { [key: string]: string } | null = GETParams === "" ? null : parseQuery(GETParams) as { [key: string]: string };
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

  if (match) {
    const data = isString(route.path)
      ? regExpResultToParams(match, paramNames)
      : match.groups
      ? match.groups
      : match.slice(1);
    return {
      url: clean(current.replace(new RegExp(`^${context.instance.root}`), "")),
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
  return typeof window?.history?.pushState === "function";
}
export function undefinedOrTrue(obj, key: string): boolean {
  return typeof obj[key] === "undefined" ? true : obj[key];
}
export function parseNavigateOptions(source?: string): NavigateOptions {
  if (!source) return {};

  const options: NavigateOptions = {};
  const resolveOptions: Partial<ResolveOptions> = {};

  const parseKeyValuePair = (str: string) => {
    const [key, value] = str.split(":").map(v => v.trim());

    switch (key) {
      case "historyAPIMethod":
        options.historyAPIMethod = value;
        break;
      case "resolveOptionsStrategy":
        resolveOptions.strategy = value as ResolveStrategy;
        break;
      case "resolveOptionsHash":
        resolveOptions.hash = value === "true";
        break;
      case "updateBrowserURL":
      case "callHandler":
      case "updateState":
      case "force":
        options[key] = value === "true";
        break;
    }
  };

  source.split(",").forEach(parseKeyValuePair);

  if (Object.keys(resolveOptions).length) {
    options.resolveOptions = resolveOptions as ResolveOptions;
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
