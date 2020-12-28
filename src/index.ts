import {
  pushStateAvailable,
  matchRoute,
  parseQuery,
  extractGETParameters,
  isFunction,
  isString,
  clean,
  undefinedOrTrue,
  parseNavigateToOptions,
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
  const lifecycle = [
    _checkForAlreadyHook,
    _checkForLeaveHook,
    _checkForBeforeHook,
    _callHandler,
    _checkForAfterHook,
  ];
  const notFoundLifeCycle = [
    _checkForNotFoundHandler,
    Q.if(
      ({ notFoundHandled }: QContext) => notFoundHandled,
      lifecycle,
      _errorOut
    ),
  ];

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
  function _checkForLeaveHook(context: QContext, done) {
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
  function _checkForBeforeHook(context: QContext, done) {
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
  function _callHandler(context: QContext, done) {
    _required(context, ["route", "match", "options"]);
    if (undefinedOrTrue(context.options, "updateState")) {
      current = context.match;
    }
    if (undefinedOrTrue(context.options, "callHandler")) {
      context.route.handler(context.match);
    }
    updatePageLinks();
    done();
  }
  function _checkForAfterHook(context: QContext, done) {
    _required(context, ["route", "match"]);
    if (context.route.hooks && context.route.hooks.after) {
      context.route.hooks.after(context.match);
    }
    done();
  }
  function _checkForAlreadyHook(context: QContext, done) {
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
  function _checkForNotFoundHandler(context: QContext, done) {
    _required(context, ["currentLocationPath"]);
    if (notFoundRoute) {
      context.notFoundHandled = true;
      const [url, queryString] = extractGETParameters(
        context.currentLocationPath
      );
      notFoundRoute.path = clean(url);
      context.match = {
        url: notFoundRoute.path,
        queryString,
        data: null,
        route: notFoundRoute,
        params: queryString !== "" ? parseQuery(queryString) : null,
      };
      context.route = notFoundRoute;
    }
    done();
  }
  function _errorOut(context: QContext, done) {
    _required(context, ["currentLocationPath"]);
    console.warn(
      `Navigo: "${context.currentLocationPath}" didn't match any of the registered routes.`
    );
    done(false);
  }
  function _setLocationPath(context: QContext, done) {
    if (typeof context.currentLocationPath === "undefined") {
      context.currentLocationPath = getCurrentEnvURL();
    }
    done();
  }
  function _findAMatch(context: QContext, done) {
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
  function _checkForDeprecationMethods(context: QContext, done) {
    if (context.options) {
      if (typeof context.options["shouldResolve"] !== "undefined") {
        console.warn(
          `"shouldResolve" is deprecated. Please check the documentation.`
        );
      }
      if (typeof context.options["silent"] !== "undefined") {
        console.warn(`"silent" is deprecated. Please check the documentation.`);
      }
    }
    done();
  }
  function _checkForForceOp(context: QContext, done) {
    _required(context, ["options"]);
    if (context.options.force === true) {
      self.current = current = pathToMatchObject(context.to);
      done(false);
    } else {
      done();
    }
  }
  function _updateBrowserURL(context: QContext, done) {
    _required(context, ["to", "options"]);
    context.to = `${clean(root)}/${clean(context.to)}`;
    if (undefinedOrTrue(context.options, "updateBrowserURL")) {
      if (isPushStateAvailable) {
        history[context.options.historyAPIMethod || "pushState"](
          context.options.stateObj || {},
          context.options.title || "",
          `/${context.to}`.replace(/\/\//g, "/") // making sure that we don't have two slashes
        );
      } else if (isWindowAvailable) {
        window.location.href = context.to;
      }
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
  function resolve(currentLocationPath?: string): boolean | Match {
    const context: QContext = {
      currentLocationPath,
      options: {},
    };
    Q(
      [
        _setLocationPath,
        _findAMatch,
        Q.if(({ match }: QContext) => match, lifecycle, notFoundLifeCycle),
      ],
      context
    );

    return context.match ? context.match : false;
  }
  function navigate(to: string, options: NavigateTo = {}): void {
    const context: QContext = { to, options, currentLocationPath: to };
    Q(
      [
        _checkForDeprecationMethods,
        _checkForForceOp,
        _findAMatch,
        Q.if(({ match }: QContext) => match, lifecycle, notFoundLifeCycle),
        _updateBrowserURL,
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
          const options = parseNavigateToOptions(
            link.getAttribute("data-navigo-options")
          );

          if (!destroyed) {
            e.preventDefault();
            self.navigate(clean(location), options);
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
  function directMatch(path: string): false | Match {
    const context: QContext = {
      currentLocationPath: path,
      options: {},
    };
    Q([_findAMatch], context);
    return context.match ? context.match : false;
  }

  this.root = root;
  this.routes = routes;
  this.destroyed = destroyed;
  this.current = current;

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
  this.match = directMatch;
  this._pathToMatchObject = pathToMatchObject;
  this._clean = clean;

  listen.call(this);
  updatePageLinks.call(this);
}
