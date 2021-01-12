"use strict";

exports.__esModule = true;
exports.default = Navigo;

var _utils = require("./utils");

var _Q = _interopRequireDefault(require("./Q"));

var _setLocationPath = _interopRequireDefault(require("./middlewares/setLocationPath"));

var _matchPathToRegisteredRoutes = _interopRequireDefault(require("./middlewares/matchPathToRegisteredRoutes"));

var _checkForDeprecationMethods = _interopRequireDefault(require("./middlewares/checkForDeprecationMethods"));

var _checkForForceOp = _interopRequireDefault(require("./middlewares/checkForForceOp"));

var _updateBrowserURL = _interopRequireDefault(require("./middlewares/updateBrowserURL"));

var _processMatches = _interopRequireDefault(require("./middlewares/processMatches"));

var _lifecycles = require("./lifecycles");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Navigo(appRoute, resolveOptions) {
  var DEFAULT_RESOLVE_OPTIONS = resolveOptions || {
    strategy: "ONE",
    hash: false,
    noMatchWarning: false
  };
  var self = this;
  var root = "/";
  var current = null;
  var routes = [];
  var destroyed = false;
  var genericHooks;
  var isPushStateAvailable = (0, _utils.pushStateAvailable)();
  var isWindowAvailable = (0, _utils.windowAvailable)();

  if (!appRoute) {
    console.warn('Navigo requires a root path in its constructor. If not provided will use "/" as default.');
  } else {
    root = (0, _utils.clean)(appRoute);
  }

  function _checkForAHash(url) {
    if (url.indexOf("#") >= 0) {
      if (DEFAULT_RESOLVE_OPTIONS.hash === true) {
        url = url.split("#")[1] || "/";
      } else {
        url = url.split("#")[0];
      }
    }

    return url;
  }

  function composePathWithRoot(path) {
    return (0, _utils.clean)(root + "/" + (0, _utils.clean)(path));
  }

  function createRoute(path, handler, hooks, name) {
    path = (0, _utils.isString)(path) ? composePathWithRoot(path) : path;
    return {
      name: name || (0, _utils.clean)(String(path)),
      path: path,
      handler: handler,
      hooks: (0, _utils.accumulateHooks)(hooks)
    };
  } // public APIs


  function on(path, handler, hooks) {
    var _this = this;

    if (typeof path === "object" && !(path instanceof RegExp)) {
      Object.keys(path).forEach(function (p) {
        if (typeof path[p] === "function") {
          _this.on(p, path[p]);
        } else {
          var _path$p = path[p],
              _handler = _path$p.uses,
              name = _path$p.as,
              _hooks = _path$p.hooks;
          routes.push(createRoute(p, _handler, [genericHooks, _hooks], name));
        }
      });
      return this;
    } else if (typeof path === "function") {
      hooks = handler;
      handler = path;
      path = root;
    }

    routes.push(createRoute(path, handler, [genericHooks, hooks]));
    return this;
  }

  function resolve(currentLocationPath, options) {
    var context = {
      instance: self,
      currentLocationPath: currentLocationPath,
      navigateOptions: {},
      resolveOptions: options || DEFAULT_RESOLVE_OPTIONS
    };
    (0, _Q.default)([_setLocationPath.default, _matchPathToRegisteredRoutes.default, _Q.default.if(function (_ref) {
      var matches = _ref.matches;
      // console.log(`${currentLocationPath} -> Matches: ${matches.length}`);
      return matches && matches.length > 0;
    }, _processMatches.default, _lifecycles.notFoundLifeCycle)], context);
    return context.matches ? context.matches : false;
  }

  function navigate(to, navigateOptions) {
    to = (0, _utils.clean)(root) + "/" + (0, _utils.clean)(to);
    var context = {
      instance: self,
      to: to,
      navigateOptions: navigateOptions || {},
      resolveOptions: navigateOptions && navigateOptions.resolveOptions ? navigateOptions.resolveOptions : DEFAULT_RESOLVE_OPTIONS,
      currentLocationPath: _checkForAHash(to)
    };
    (0, _Q.default)([_checkForDeprecationMethods.default, _checkForForceOp.default, _matchPathToRegisteredRoutes.default, _Q.default.if(function (_ref2) {
      var matches = _ref2.matches;
      return matches && matches.length > 0;
    }, _processMatches.default, _lifecycles.notFoundLifeCycle), _updateBrowserURL.default], context);
  }

  function off(what) {
    this.routes = routes = routes.filter(function (r) {
      if ((0, _utils.isString)(what)) {
        return (0, _utils.clean)(r.path) !== (0, _utils.clean)(what);
      } else if ((0, _utils.isFunction)(what)) {
        return what !== r.handler;
      }

      return String(r.path) !== String(what);
    });
    return this;
  }

  function listen() {
    if (isPushStateAvailable) {
      this.__popstateListener = function () {
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

  function notFound(handler, hooks) {
    self._notFoundRoute = createRoute("*", handler, [genericHooks, hooks], "__NOT_FOUND__");
    return this;
  }

  function updatePageLinks() {
    if (!isWindowAvailable) return;
    findLinks().forEach(function (link) {
      if (!link.hasListenerAttached) {
        link.addEventListener("click", function (e) {
          if ((e.ctrlKey || e.metaKey) && e.target.tagName.toLowerCase() === "a") {
            return false;
          }

          var location = link.getAttribute("href");

          if (typeof location === "undefined" || location === null) {
            return false;
          } // handling absolute paths


          if (location.match(/^(http|https)/) && typeof URL !== "undefined") {
            try {
              var u = new URL(location);
              location = u.pathname + u.search;
            } catch (err) {}
          }

          var options = (0, _utils.parseNavigateOptions)(link.getAttribute("data-navigo-options"));

          if (!destroyed) {
            e.preventDefault();
            e.stopPropagation();
            self.navigate((0, _utils.clean)(location), options);
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

  function link(path) {
    return "/" + root + "/" + (0, _utils.clean)(path);
  }

  function setGenericHooks(hooks) {
    genericHooks = hooks;
    return this;
  }

  function lastResolved() {
    return current;
  }

  function generate(name, data) {
    var result = routes.reduce(function (result, route) {
      var key;

      if (route.name === name) {
        result = route.path;

        for (key in data) {
          result = result.replace(":" + key, data[key]);
        }
      }

      return result;
    }, "");
    return !result.match(/^\//) ? "/" + result : result;
  }

  function getLinkPath(link) {
    return link.getAttribute("href");
  }

  function pathToMatchObject(path) {
    var _extractGETParameters = (0, _utils.extractGETParameters)((0, _utils.clean)(path)),
        url = _extractGETParameters[0],
        queryString = _extractGETParameters[1];

    var params = queryString === "" ? null : (0, _utils.parseQuery)(queryString);
    var route = createRoute(url, function () {}, [genericHooks], url);
    return {
      url: url,
      queryString: queryString,
      route: route,
      data: null,
      params: params
    };
  }

  function getCurrentLocation() {
    return pathToMatchObject((0, _utils.clean)((0, _utils.getCurrentEnvURL)(root)).replace(new RegExp("^" + root), ""));
  }

  function directMatchWithRegisteredRoutes(path) {
    var context = {
      instance: self,
      currentLocationPath: path,
      navigateOptions: {},
      resolveOptions: DEFAULT_RESOLVE_OPTIONS
    };
    (0, _matchPathToRegisteredRoutes.default)(context, function () {});
    return context.matches ? context.matches : false;
  }

  function directMatchWithLocation(path, currentLocation) {
    var context = {
      instance: self,
      currentLocationPath: currentLocation
    };
    (0, _setLocationPath.default)(context, function () {});
    path = (0, _utils.clean)(path);
    var match = (0, _utils.matchRoute)(context.currentLocationPath, {
      name: path,
      path: path,
      handler: function handler() {},
      hooks: {}
    });
    return match ? match : false;
  }

  function addHook(type, route, func) {
    if (typeof route === "string") {
      route = getRoute(route);
    }

    if (route) {
      if (!route.hooks[type]) route.hooks[type] = [];
      route.hooks[type].push(func);
      return function () {
        route.hooks[type] = route.hooks[type].filter(function (f) {
          return f !== func;
        });
      };
    } else {
      console.warn("Route doesn't exists: " + route);
    }

    return function () {};
  }

  function getRoute(nameOrHandler) {
    if (typeof nameOrHandler === "string") {
      return routes.find(function (r) {
        return r.name === composePathWithRoot(nameOrHandler);
      });
    }

    return routes.find(function (r) {
      return r.handler === nameOrHandler;
    });
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

  this.extractGETParameters = function (url) {
    return (0, _utils.extractGETParameters)(_checkForAHash(url));
  };

  this.lastResolved = lastResolved;
  this.generate = generate;
  this.getLinkPath = getLinkPath;
  this.match = directMatchWithRegisteredRoutes;
  this.matchLocation = directMatchWithLocation;
  this.getCurrentLocation = getCurrentLocation;
  this.addBeforeHook = addHook.bind(this, "before");
  this.addAfterHook = addHook.bind(this, "after");
  this.addAlreadyHook = addHook.bind(this, "already");
  this.addLeaveHook = addHook.bind(this, "leave");
  this.getRoute = getRoute;
  this._pathToMatchObject = pathToMatchObject;
  this._clean = _utils.clean;
  this._checkForAHash = _checkForAHash;

  this._setCurrent = function (c) {
    return current = self.current = c;
  };

  listen.call(this);
  updatePageLinks.call(this);
}

module.exports = exports.default;