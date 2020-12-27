import {
  pushStateAvailable,
  matchRoute,
  parseQuery,
  extractGETParameters,
  isFunction,
  isString,
  clean,
} from "./utils";
import Q from "./Q";

export default function Navigo(r?: string) {
  let root = "/";
  let current: Match = null;
  let routes: Route[] = [];
  let notFoundRoute: Route;
  let destroyed = false;
  let genericHooks: RouteHooks;
  let self = this;
  const isPushStateAvailable = pushStateAvailable();
  const isWindowAvailable = typeof window !== "undefined";

  if (!r) {
    console.warn(
      'Navigo requires a root path in its constructor. If not provided will use "/" as default.'
    );
  } else {
    root = clean(r);
  }

  // functions that are part of Q (queue) processing
  function _required(obj: Object, fields: string[]) {
    for (let i = 0; i < fields.length; i++) {
      if (typeof obj[fields[i]] === "undefined") {
        throw new Error(
          `Navigo internal error. Required field "${fields[i]}" is missing in a queue context.`
        );
      }
    }
  }
  function _checkForLeaveHook(context, done) {
    if (current && current.route.hooks && current.route.hooks.leave) {
      current.route.hooks.leave((moveForward: boolean) => {
        if (typeof moveForward === "undefined" || moveForward === true) {
          done();
        }
      }, current);
      return;
    }
    done();
  }
  function _checkForBeforeHook(context, done) {
    _required(context, ["route", "match"]);
    if (context.route.hooks && context.route.hooks.before) {
      context.route.hooks.before((moveForward: boolean) => {
        if (typeof moveForward === "undefined" || moveForward === true) {
          done();
        }
      }, context.match);
    } else {
      done();
    }
  }
  function _callHandler(context, done) {
    _required(context, ["route", "match"]);
    current = context.match;
    context.route.handler(current);
    updatePageLinks();
    done();
  }
  function _checkForAfterHook(context, done) {
    _required(context, ["route", "match"]);
    if (context.route.hooks && context.route.hooks.after) {
      context.route.hooks.after(context.match);
    }
    done();
  }
  function _checkForAlreadyHook(context, done) {
    _required(context, ["route", "match"]);
    if (
      current &&
      current.route === context.route &&
      current.url === context.match.url &&
      current.queryString === context.match.queryString
    ) {
      if (current.route.hooks && current.route.hooks.already) {
        current.route.hooks.already(context.match);
      }
      done(false);
      return;
    }
    done();
  }
  function _checkForNotFoundHandler(context, done) {
    _required(context, ["currentLocationPath"]);
    if (notFoundRoute) {
      context.notFoundHandled = true;
      const [url, queryString] = extractGETParameters(
        context.currentLocationPath
      );
      notFoundRoute.path = clean(url);
      hooksAndCallHandler(notFoundRoute, {
        url: notFoundRoute.path,
        queryString,
        data: null,
        route: notFoundRoute,
        params: queryString !== "" ? parseQuery(queryString) : null,
      });
    }
    done();
  }
  function _errorOut(context, done) {
    _required(context, ["currentLocationPath"]);
    console.warn(
      `Navigo: "${context.currentLocationPath}" didn't match any of the registered routes.`
    );
    done(false);
  }
  function _setLocationPath(context, done) {
    if (typeof context.currentLocationPath === "undefined") {
      context.currentLocationPath = getCurrentEnvURL();
    }
    done();
  }
  function _findAMatch(context, done) {
    _required(context, ["currentLocationPath"]);
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const match: false | Match = matchRoute(
        context.currentLocationPath,
        route
      );
      if (match) {
        context.match = match;
        context.route = route;
        done();
        return;
      }
    }
    done();
  }
  function _checkForSilentMode(context, done) {
    if (context.options.silent === true) {
      self.current = current = pathToMatchObject(context.to);
      done(false);
      return;
    }
    done();
  }
  function _updateBrowserURL(context, done) {
    _required(context, ["to", "options"]);
    context.to = `${clean(root)}/${clean(context.to)}`;
    if (isPushStateAvailable) {
      history[context.options.historyAPIMethod || "pushState"](
        context.options.stateObj || {},
        context.options.title || "",
        `/${context.to}`.replace(/\/\//g, "/") // making sure that we don't have two slashes
      );
    } else if (isWindowAvailable) {
      window.location.href = context.to;
    }
    done();
  }

  // public APIs
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
    const leaveHook = (done) => {
      if (current && current.route.hooks && current.route.hooks.leave) {
        current.route.hooks.leave((moveForward: boolean) => {
          if (typeof moveForward === "undefined" || moveForward === true) {
            done();
          }
        }, current);
        return;
      }
      done();
    };
    const callHandler = () => {
      current = match;
      route.handler(match);
      updatePageLinks();
      if (route.hooks && route.hooks.after) {
        route.hooks.after(match);
      }
    };
    if (route.hooks && route.hooks.before) {
      route.hooks.before((moveForward: boolean) => {
        if (typeof moveForward === "undefined" || moveForward === true) {
          leaveHook(callHandler);
        }
      }, match);
    } else {
      leaveHook(callHandler);
    }
  }
  function resolve(currentLocationPath?: string): boolean | Match {
    const context: { match?: Match; currentLocationPath?: string } = {
      currentLocationPath,
    };
    Q(
      [
        _setLocationPath,
        _findAMatch,
        [
          (context) => context.match,
          [
            _checkForAlreadyHook,
            _checkForLeaveHook,
            _checkForBeforeHook,
            _callHandler,
            _checkForAfterHook,
          ],
          [
            _checkForNotFoundHandler,
            [(context) => context.notFoundHandled, [], [_errorOut]],
          ],
        ],
      ],
      context
    );

    return context.match ? context.match : false;
  }
  function navigate(to: string, options: NavigateTo = {}): void {
    const context = { to, options, currentLocationPath: to };
    Q(
      [
        _checkForSilentMode,
        [
          (context) =>
            typeof context.options.shouldResolve === "undefined" ||
            context.options.shouldResolve === true,
          [
            _findAMatch,
            [
              (context) => context.match,
              [
                _checkForLeaveHook,
                _checkForBeforeHook,
                _checkForAlreadyHook,
                _updateBrowserURL,
                _callHandler,
                _checkForAfterHook,
              ],
              [
                _checkForNotFoundHandler,
                [
                  (context) => context.notFoundHandled,
                  [_updateBrowserURL],
                  [_errorOut],
                ],
              ],
            ],
          ],
          [_updateBrowserURL],
        ],
      ],
      context
    );
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
  function pathToMatchObject(path: string): Match {
    const [url, queryString] = extractGETParameters(clean(path));
    const params = queryString === "" ? null : parseQuery(queryString);
    const route = createRoute(url, () => {}, genericHooks, url);
    return {
      url,
      queryString,
      route,
      data: null,
      params: params,
    };
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
  this._pathToMatchObject = pathToMatchObject;
  this._matchRoute = matchRoute;
  this._clean = clean;

  listen.call(this);
  updatePageLinks.call(this);
}
