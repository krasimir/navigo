import {
  Match,
  Route,
  RouteHooks,
  QContext,
  NavigateOptions,
  ResolveOptions,
} from "../index";
import {
  pushStateAvailable,
  matchRoute,
  parseQuery,
  extractGETParameters,
  isFunction,
  isString,
  clean,
  undefinedOrTrue,
  parseNavigateOptions,
} from "./utils";
import Q from "./Q";

export default function Navigo(r?: string, resolveOptions?: ResolveOptions) {
  let DEFAULT_RESOLVE_OPTIONS: ResolveOptions = resolveOptions || {
    strategy: "ONE",
    noMatchWarning: false,
  };
  let root = "/";
  let current: Match[] = null;
  let routes: Route[] = [];
  let notFoundRoute: Route;
  let destroyed = false;
  let genericHooks: RouteHooks;
  let self = this;
  const isPushStateAvailable = pushStateAvailable();
  const isWindowAvailable = typeof window !== "undefined";
  const foundLifecycle = [
    _checkForAlreadyHook,
    _checkForLeaveHook,
    _checkForBeforeHook,
    _callHandler,
    _checkForAfterHook,
  ];
  const notFoundLifeCycle = [
    _checkForNotFoundHandler,
    Q.if(({ notFoundHandled }: QContext) => notFoundHandled, foundLifecycle, [
      _errorOut,
      _checkForLeaveHook,
    ]),
    _flushCurrent,
  ];

  if (!r) {
    console.warn(
      'Navigo requires a root path in its constructor. If not provided will use "/" as default.'
    );
  } else {
    root = clean(r);
  }

  function _checkForLeaveHook(context: QContext, done) {
    if (!current) {
      done();
      return;
    }
    // console.log(`url=${context.match.url} OLD=${current.length}`);
    Q(
      [
        ...current.map((oldMatch) => {
          return (_, leaveLoopDone) => {
            // no leave hook
            if (!oldMatch.route.hooks || !oldMatch.route.hooks.leave) {
              leaveLoopDone();
              return;
            }
            // no match or different path
            if (
              !context.match ||
              !directMatchWithLocation(
                oldMatch.route.path as string,
                context.match.url
              )
            ) {
              oldMatch.route.hooks.leave((moveForward: boolean) => {
                if (
                  typeof moveForward === "undefined" ||
                  moveForward === true
                ) {
                  leaveLoopDone();
                }
              }, context.match);
              return;
            } else {
              leaveLoopDone();
            }
          };
        }),
      ],
      {},
      () => done()
    );
  }
  function _checkForBeforeHook(context: QContext, done) {
    if (context.match.route.hooks && context.match.route.hooks.before) {
      context.match.route.hooks.before((moveForward: boolean) => {
        if (typeof moveForward === "undefined" || moveForward === true) {
          done();
        }
      }, context.match);
    } else {
      done();
    }
  }
  function _callHandler(context: QContext, done) {
    if (undefinedOrTrue(context.navigateOptions, "updateState")) {
      current = self.current = context.matches;
    }
    if (undefinedOrTrue(context.navigateOptions, "callHandler")) {
      context.match.route.handler(context.match);
    }
    updatePageLinks();
    done();
  }
  function _checkForAfterHook(context: QContext, done) {
    if (context.match.route.hooks && context.match.route.hooks.after) {
      context.match.route.hooks.after(context.match);
    }
    done();
  }
  function _checkForAlreadyHook(context: QContext, done) {
    if (
      current &&
      current[0] &&
      current[0].route === context.match.route &&
      current[0].url === context.match.url &&
      current[0].queryString === context.match.queryString
    ) {
      current.forEach((c) => {
        if (c.route.hooks && c.route.hooks.already) {
          c.route.hooks.already(context.match);
        }
      });
      done(false);
      return;
    }
    done();
  }
  function _checkForNotFoundHandler(context: QContext, done) {
    if (notFoundRoute) {
      context.notFoundHandled = true;
      const [url, queryString] = extractGETParameters(
        context.currentLocationPath
      );
      notFoundRoute.path = clean(url);
      const notFoundMatch: Match = {
        url: notFoundRoute.path,
        queryString,
        data: null,
        route: notFoundRoute,
        params: queryString !== "" ? parseQuery(queryString) : null,
      };
      context.matches = [notFoundMatch];
      context.match = notFoundMatch;
    }
    done();
  }
  function _errorOut(context: QContext, done) {
    if (
      !context.resolveOptions ||
      context.resolveOptions.noMatchWarning === false ||
      typeof context.resolveOptions.noMatchWarning === "undefined"
    )
      console.warn(
        `Navigo: "${context.currentLocationPath}" didn't match any of the registered routes.`
      );
    done();
  }
  function _setLocationPath(context: QContext, done) {
    if (typeof context.currentLocationPath === "undefined") {
      context.currentLocationPath = getCurrentEnvURL();
    }
    done();
  }
  function _matchPathToRegisteredRoutes(context: QContext, done) {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const match: false | Match = matchRoute(
        context.currentLocationPath,
        route
      );
      if (match) {
        if (!context.matches) context.matches = [];
        context.matches.push(match);
        if (context.resolveOptions.strategy === "ONE") {
          done();
          return;
        }
      }
    }
    done();
  }
  function _checkForDeprecationMethods(context: QContext, done) {
    if (context.navigateOptions) {
      if (typeof context.navigateOptions["shouldResolve"] !== "undefined") {
        console.warn(
          `"shouldResolve" is deprecated. Please check the documentation.`
        );
      }
      if (typeof context.navigateOptions["silent"] !== "undefined") {
        console.warn(`"silent" is deprecated. Please check the documentation.`);
      }
    }
    done();
  }
  function _checkForForceOp(context: QContext, done) {
    if (context.navigateOptions.force === true) {
      self.current = current = [pathToMatchObject(context.to)];
      done(false);
    } else {
      done();
    }
  }
  function _updateBrowserURL(context: QContext, done) {
    if (undefinedOrTrue(context.navigateOptions, "updateBrowserURL")) {
      if (isPushStateAvailable) {
        history[context.navigateOptions.historyAPIMethod || "pushState"](
          context.navigateOptions.stateObj || {},
          context.navigateOptions.title || "",
          `/${context.to}`.replace(/\/\//g, "/") // making sure that we don't have two slashes
        );
      } else if (isWindowAvailable) {
        window.location.href = context.to;
      }
    }
    done();
  }
  function _flushCurrent(context: QContext, done) {
    current = self.current = null;
    done();
  }
  function _processMatches(context: QContext, done) {
    let idx = 0;
    // console.log(
    //   "_processMatches matches=" +
    //     (context.matches ? context.matches.length : 0)
    // );
    (function nextMatch() {
      if (idx === context.matches.length) {
        done();
        return;
      }
      Q(
        foundLifecycle,
        { ...context, match: context.matches[idx] },
        function end() {
          idx += 1;
          nextMatch();
        }
      );
    })();
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
  function resolve(
    currentLocationPath?: string,
    options?: ResolveOptions
  ): false | Match[] {
    const context: QContext = {
      currentLocationPath,
      navigateOptions: {},
      resolveOptions: options || DEFAULT_RESOLVE_OPTIONS,
    };
    Q(
      [
        _setLocationPath,
        _matchPathToRegisteredRoutes,
        Q.if(
          ({ matches }: QContext) => {
            // console.log(`${currentLocationPath} -> Matches: ${matches.length}`);
            return matches && matches.length > 0;
          },
          _processMatches,
          notFoundLifeCycle
        ),
      ],
      context
    );

    return context.matches ? context.matches : false;
  }
  function navigate(to: string, navigateOptions?: NavigateOptions): void {
    to = `${clean(root)}/${clean(to)}`;
    const context: QContext = {
      to,
      navigateOptions: navigateOptions || {},
      resolveOptions:
        navigateOptions && navigateOptions.resolveOptions
          ? navigateOptions.resolveOptions
          : DEFAULT_RESOLVE_OPTIONS,
      currentLocationPath: to,
    };
    Q(
      [
        _checkForDeprecationMethods,
        _checkForForceOp,
        _matchPathToRegisteredRoutes,
        Q.if(
          ({ matches }: QContext) => matches && matches.length > 0,
          _processMatches,
          notFoundLifeCycle
        ),
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
          let location = link.getAttribute("href");
          if (typeof location === "undefined" || location === null) {
            return false;
          }
          // handling absolute paths
          if (location.match(/^(http|https)/) && typeof URL !== "undefined") {
            try {
              const u = new URL(location);
              location = u.pathname + u.search;
            } catch (err) {}
          }
          const options = parseNavigateOptions(
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
    return self;
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
  function lastResolved(): Match[] | null {
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
  function directMatchWithRegisteredRoutes(path: string): false | Match[] {
    const context: QContext = {
      currentLocationPath: path,
      navigateOptions: {},
      resolveOptions: DEFAULT_RESOLVE_OPTIONS,
    };
    _matchPathToRegisteredRoutes(context, () => {});
    return context.matches ? context.matches : false;
  }
  function directMatchWithLocation(
    path: string,
    currentLocation?: string
  ): false | Match {
    const context: QContext = { currentLocationPath: currentLocation };
    _setLocationPath(context, () => {});
    path = clean(path);
    const match = matchRoute(context.currentLocationPath, {
      name: path,
      path,
      handler: () => {},
      hooks: {},
    });
    return match ? match : false;
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
  this.match = directMatchWithRegisteredRoutes;
  this.matchLocation = directMatchWithLocation;
  this._pathToMatchObject = pathToMatchObject;
  this._clean = clean;

  listen.call(this);
  updatePageLinks.call(this);
}
