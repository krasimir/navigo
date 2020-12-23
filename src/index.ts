const PARAMETER_REGEXP = /([:*])(\w+)/g;
const WILDCARD_REGEXP = /\*/g;
const REPLACE_VARIABLE_REGEXP = "([^/]+)";
const REPLACE_WILDCARD = "(?:.*)";
const START_BY_SLASH_REGEXP = "(?:/^|^)";
const MATCH_REGEXP_FLAGS = "";

function clean(s: string) {
  return s.split("#")[0].replace(/\/+$/, "").replace(/^\/+/, "");
}
function isString(s: any): boolean {
  return typeof s === "string";
}
function isFunction(s: any): boolean {
  return typeof s === "function";
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
  const tmp = clean(url).split(/\?(.*)?$/);
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
        .replace(WILDCARD_REGEXP, REPLACE_WILDCARD) +
      "$";
    if (clean(route.path as string) === "") {
      if (clean(current) === "") {
        return {
          url: current,
          queryString: GETParams,
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
      : match.slice(1);
    return {
      url: current,
      queryString: GETParams,
      route: route,
      data,
      params,
    };
  }
  return false;
}
function pushStateAvailable(): boolean {
  return !!(
    typeof window !== "undefined" &&
    window.history &&
    window.history.pushState
  );
}

export default function Navigo(r?: string) {
  let root = "/";
  let current: Match = null;
  let routes: Route[] = [];
  let notFoundRoute: Route;
  let destroyed = false;
  let genericHooks: RouteHooks;
  const isPushStateAvailable = pushStateAvailable();
  const isWindowAvailable = typeof window !== "undefined";

  if (!r) {
    console.warn(
      'Navigo requires a root path in its constructor. If not provided will use "/" as default.'
    );
  } else {
    root = clean(r);
  }

  function createRoute(
    path: string | RegExp,
    handler: Function,
    hooks: RouteHooks,
    name?: string
  ): Route {
    path = isString(path) ? clean(`${root}/${clean(path as string)}`) : path;
    return {
      name: name || String(path),
      path,
      handler,
      hooks,
    };
  }
  function getCurrentEnvURL(): string {
    if (isWindowAvailable) {
      return location.pathname + location.search + location.hash;
    }
    return root;
  }
  function on(
    path: string | Function | Object | RegExp,
    handler?: Function,
    hooks?: RouteHooks
  ) {
    if (typeof path === "object" && !(path instanceof RegExp)) {
      Object.keys(path).forEach((p) => {
        if (typeof path[p] === "function") {
          this.on(p, path[p]);
        } else {
          const { uses: handler, as: name, hooks } = path[p];
          routes.push(createRoute(p, handler, hooks || genericHooks, name));
        }
      });
      return this;
    } else if (typeof path === "function") {
      hooks = handler as RouteHooks;
      handler = path as Function;
      path = root;
    }
    routes.push(
      createRoute(path as string | RegExp, handler, hooks || genericHooks)
    );
    return this;
  }
  function hooksAndCallHandler(route: Route, match: Match) {
    const callHandler = () => {
      if (current && current.route.hooks && current.route.hooks.leave) {
        current.route.hooks.leave(current);
      }
      current = match;
      route.handler(match);
      updatePageLinks();
      if (route.hooks && route.hooks.after) {
        route.hooks.after(match);
      }
    };
    if (route.hooks && route.hooks.before) {
      route.hooks.before((shouldResolve: boolean) => {
        if (typeof shouldResolve === "undefined" || shouldResolve === true) {
          callHandler();
        }
      }, match);
    } else {
      callHandler();
    }
  }
  function resolve(currentLocationPath?: string): boolean | Match {
    if (typeof currentLocationPath === "undefined") {
      currentLocationPath = getCurrentEnvURL();
    }
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const match: false | Match = matchRoute(currentLocationPath, route);
      if (match) {
        if (
          current &&
          current.route === route &&
          current.url === match.url &&
          current.queryString === match.queryString
        ) {
          if (current.route.hooks && current.route.hooks.already) {
            current.route.hooks.already(match);
          }
          return false;
        }
        hooksAndCallHandler(route, match);
        return match;
      }
    }
    if (notFoundRoute) {
      const [url, queryString] = extractGETParameters(currentLocationPath);
      notFoundRoute.path = clean(url);
      hooksAndCallHandler(notFoundRoute, {
        url: notFoundRoute.path,
        queryString,
        data: null,
        route: notFoundRoute,
        params: queryString !== "" ? parseQuery(queryString) : null,
      });
      return true;
    }
    console.warn(
      `Navigo: "${currentLocationPath}" didn't match any of the registered routes.`
    );
    return false;
  }
  function off(what: string | RegExp | Function) {
    this.routes = routes = routes.filter((r) => {
      if (isString(what)) {
        return clean(r.path as string) !== clean(what as string);
      } else if (isFunction(what)) {
        return what !== r.handler;
      }
      return String(r.path) !== String(what);
    });
    return this;
  }
  function navigate(to: string, options: NavigateTo = {}): void {
    to = `${clean(root)}/${clean(to)}`;
    if (isPushStateAvailable) {
      history[options.historyAPIMethod || "pushState"](
        options.stateObj || {},
        options.title || "",
        `/${to}`.replace(/\/\//g, "/") // making sure that we don't have two slashes
      );
    } else if (isWindowAvailable) {
      window.location.href = to;
    }
    if (
      typeof options.shouldResolve === "undefined" ||
      options.shouldResolve === true
    ) {
      resolve();
    }
  }
  function listen() {
    if (isPushStateAvailable) {
      this.__popstateListener = () => {
        resolve();
      };
      window.addEventListener("popstate", this.__popstateListener);
    }
  }
  function destroy() {
    this.routes = routes = [];
    if (isPushStateAvailable) {
      window.removeEventListener("popstate", this.__popstateListener);
    }
    this.destroyed = destroyed = true;
  }
  function notFound(handler, hooks?: RouteHooks) {
    notFoundRoute = createRoute(
      "/",
      handler,
      hooks || genericHooks,
      "__NOT_FOUND__"
    );
    return this;
  }
  function updatePageLinks() {
    if (!isWindowAvailable) return;
    findLinks().forEach((link) => {
      if (!link.hasListenerAttached) {
        link.addEventListener("click", function (e) {
          if (
            (e.ctrlKey || e.metaKey) &&
            e.target.tagName.toLowerCase() === "a"
          ) {
            return false;
          }
          const location = link.getAttribute("href");

          if (!destroyed) {
            e.preventDefault();
            navigate(clean(location));
          }
        });
        link.hasListenerAttached = true;
      }
    });
    return this;
  }
  function findLinks() {
    if (isWindowAvailable) {
      return [].slice.call(document.querySelectorAll("[data-navigo]"));
    }
    return [];
  }
  function link(path: string) {
    return `/${root}/${clean(path)}`;
  }
  function setGenericHooks(hooks: RouteHooks) {
    genericHooks = hooks;
    return this;
  }
  function lastResolved(): Match | null {
    return current;
  }
  function generate(name: string, data?: Object): string {
    const result = routes.reduce((result, route) => {
      let key;

      if (route.name === name) {
        result = route.path as string;
        for (key in data) {
          result = result.replace(":" + key, data[key]);
        }
      }
      return result;
    }, "");
    return !result.match(/^\//) ? `/${result}` : result;
  }
  function getLinkPath(link) {
    return link.getAttribute("href");
  }

  this.root = root;
  this.routes = routes;
  this.destroyed = destroyed;

  this.on = on;
  this.off = off;
  this.resolve = resolve;
  this.navigate = navigate;
  this.destroy = destroy;
  this.notFound = notFound;
  this.updatePageLinks = updatePageLinks;
  this.link = link;
  this.hooks = setGenericHooks;
  this.extractGETParameters = extractGETParameters;
  this.lastResolved = lastResolved;
  this.generate = generate;
  this.getLinkPath = getLinkPath;
  this._matchRoute = matchRoute;
  this._clean = clean;

  listen.call(this);
  updatePageLinks.call(this);
}
