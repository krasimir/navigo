function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { pushStateAvailable, matchRoute, parseQuery, extractGETParameters, isFunction, isString, clean, parseNavigateOptions, windowAvailable, getCurrentEnvURL, accumulateHooks, extractHashFromURL } from "./utils";
import Q from "./Q";
import setLocationPath from "./middlewares/setLocationPath";
import matchPathToRegisteredRoutes from "./middlewares/matchPathToRegisteredRoutes";
import checkForDeprecationMethods from "./middlewares/checkForDeprecationMethods";
import checkForForceOp from "./middlewares/checkForForceOp";
import updateBrowserURL from "./middlewares/updateBrowserURL";
import processMatches from "./middlewares/processMatches";
import waitingList from "./middlewares/waitingList";
import { notFoundLifeCycle } from "./lifecycles";
var DEFAULT_LINK_SELECTOR = "[data-navigo]";
export default function Navigo(appRoute, options) {
  var DEFAULT_RESOLVE_OPTIONS = options || {
    strategy: "ONE",
    hash: false,
    noMatchWarning: false,
    linksSelector: DEFAULT_LINK_SELECTOR
  };
  var self = this;
  var root = "/";
  var current = null;
  var routes = [];
  var destroyed = false;
  var genericHooks;
  var isPushStateAvailable = pushStateAvailable();
  var isWindowAvailable = windowAvailable();

  if (!appRoute) {
    console.warn('Navigo requires a root path in its constructor. If not provided will use "/" as default.');
  } else {
    root = clean(appRoute);
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
    return clean(root + "/" + clean(path));
  }

  function createRoute(path, handler, hooks, name) {
    path = isString(path) ? composePathWithRoot(path) : path;
    return {
      name: name || clean(String(path)),
      path: path,
      handler: handler,
      hooks: accumulateHooks(hooks)
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

  function resolve(to, options) {
    if (self.__dirty) {
      self.__waiting.push(function () {
        return self.resolve(to, options);
      });

      return;
    } else {
      self.__dirty = true;
    }

    to = to ? clean(root) + "/" + clean(to) : undefined; // console.log("-- resolve --> " + to, self.__dirty);

    var context = {
      instance: self,
      to: to,
      currentLocationPath: to,
      navigateOptions: {},
      resolveOptions: _extends({}, DEFAULT_RESOLVE_OPTIONS, options)
    };
    Q([setLocationPath, matchPathToRegisteredRoutes, Q["if"](function (_ref) {
      var matches = _ref.matches;
      return matches && matches.length > 0;
    }, processMatches, notFoundLifeCycle)], context, waitingList);
    return context.matches ? context.matches : false;
  }

  function navigate(to, navigateOptions) {
    // console.log("-- navigate --> " + to, self.__dirty);
    if (self.__dirty) {
      self.__waiting.push(function () {
        return self.navigate(to, navigateOptions);
      });

      return;
    } else {
      self.__dirty = true;
    }

    to = clean(root) + "/" + clean(to);
    var context = {
      instance: self,
      to: to,
      navigateOptions: navigateOptions || {},
      resolveOptions: navigateOptions && navigateOptions.resolveOptions ? navigateOptions.resolveOptions : DEFAULT_RESOLVE_OPTIONS,
      currentLocationPath: _checkForAHash(to)
    };
    Q([checkForDeprecationMethods, checkForForceOp, matchPathToRegisteredRoutes, Q["if"](function (_ref2) {
      var matches = _ref2.matches;
      return matches && matches.length > 0;
    }, processMatches, notFoundLifeCycle), updateBrowserURL, waitingList], context, waitingList);
  }

  function navigateByName(name, data, options) {
    var url = generate(name, data);

    if (url !== null) {
      navigate(url.replace(new RegExp("^/?" + root), ""), options);
      return true;
    }

    return false;
  }

  function off(what) {
    this.routes = routes = routes.filter(function (r) {
      if (isString(what)) {
        return clean(r.path) !== clean(what);
      } else if (isFunction(what)) {
        return what !== r.handler;
      }

      return String(r.path) !== String(what);
    });
    return this;
  }

  function listen() {
    if (isPushStateAvailable) {
      this.__popstateListener = function () {
        if (!self.__freezeListening) {
          resolve();
        }
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
      if ("false" === link.getAttribute("data-navigo") || "_blank" === link.getAttribute("target")) {
        if (link.hasListenerAttached) {
          link.removeEventListener("click", link.navigoHandler);
        }

        return;
      }

      if (!link.hasListenerAttached) {
        link.hasListenerAttached = true;

        link.navigoHandler = function (e) {
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

          var options = parseNavigateOptions(link.getAttribute("data-navigo-options"));

          if (!destroyed) {
            e.preventDefault();
            e.stopPropagation();
            self.navigate(clean(location), options);
          }
        };

        link.addEventListener("click", link.navigoHandler);
      }
    });
    return self;
  }

  function findLinks() {
    if (isWindowAvailable) {
      return [].slice.call(document.querySelectorAll(DEFAULT_RESOLVE_OPTIONS.linksSelector || DEFAULT_LINK_SELECTOR));
    }

    return [];
  }

  function link(path) {
    return "/" + root + "/" + clean(path);
  }

  function setGenericHooks(hooks) {
    genericHooks = hooks;
    return this;
  }

  function lastResolved() {
    return current;
  }

  function generate(name, data, options) {
    var route = routes.find(function (r) {
      return r.name === name;
    });
    var result = null;

    if (route) {
      result = route.path;

      if (data) {
        for (var key in data) {
          result = result.replace(":" + key, data[key]);
        }
      }

      result = !result.match(/^\//) ? "/" + result : result;
    }

    if (result && options && !options.includeRoot) {
      result = result.replace(new RegExp("^/" + root), "");
    }

    return result;
  }

  function getLinkPath(link) {
    return link.getAttribute("href");
  }

  function pathToMatchObject(path) {
    var _extractGETParameters = extractGETParameters(clean(path)),
        url = _extractGETParameters[0],
        queryString = _extractGETParameters[1];

    var params = queryString === "" ? null : parseQuery(queryString);
    var hashString = extractHashFromURL(path);
    var route = createRoute(url, function () {}, [genericHooks], url);
    return {
      url: url,
      queryString: queryString,
      hashString: hashString,
      route: route,
      data: null,
      params: params
    };
  }

  function getCurrentLocation() {
    return pathToMatchObject(clean(getCurrentEnvURL(root)).replace(new RegExp("^" + root), ""));
  }

  function directMatchWithRegisteredRoutes(path) {
    var context = {
      instance: self,
      currentLocationPath: path,
      to: path,
      navigateOptions: {},
      resolveOptions: DEFAULT_RESOLVE_OPTIONS
    };
    matchPathToRegisteredRoutes(context, function () {});
    return context.matches ? context.matches : false;
  }

  function directMatchWithLocation(path, currentLocation, annotatePathWithRoot) {
    if (typeof currentLocation !== "undefined" && (typeof annotatePathWithRoot === "undefined" || annotatePathWithRoot)) {
      currentLocation = composePathWithRoot(currentLocation);
    }

    var context = {
      instance: self,
      to: currentLocation,
      currentLocationPath: currentLocation
    };
    setLocationPath(context, function () {});

    if (typeof path === "string") {
      path = typeof annotatePathWithRoot === "undefined" || annotatePathWithRoot ? composePathWithRoot(path) : path;
    }

    var match = matchRoute(context, {
      name: String(path),
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

  function __markAsClean(context) {
    context.instance.__dirty = false;

    if (context.instance.__waiting.length > 0) {
      context.instance.__waiting.shift()();
    }
  }

  this.root = root;
  this.routes = routes;
  this.destroyed = destroyed;
  this.current = current;
  this.__freezeListening = false;
  this.__waiting = [];
  this.__dirty = false;
  this.__markAsClean = __markAsClean;
  this.on = on;
  this.off = off;
  this.resolve = resolve;
  this.navigate = navigate;
  this.navigateByName = navigateByName;
  this.destroy = destroy;
  this.notFound = notFound;
  this.updatePageLinks = updatePageLinks;
  this.link = link;
  this.hooks = setGenericHooks;

  this.extractGETParameters = function (url) {
    return extractGETParameters(_checkForAHash(url));
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
  this._clean = clean;
  this._checkForAHash = _checkForAHash;

  this._setCurrent = function (c) {
    return current = self.current = c;
  };

  listen.call(this);
  updatePageLinks.call(this);
}