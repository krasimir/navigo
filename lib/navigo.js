(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Navigo", [], factory);
	else if(typeof exports === 'object')
		exports["Navigo"] = factory();
	else
		root["Navigo"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Q.ts":
/*!******************!*\
  !*** ./src/Q.ts ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Q
/* harmony export */ });
function Q(funcs, c) {
  var context = c || {};
  var idx = 0;

  (function next() {
    if (!funcs[idx]) return;

    if (Array.isArray(funcs[idx])) {
      funcs.splice.apply(funcs, [idx, 1].concat(funcs[idx][0](context) ? funcs[idx][1] : funcs[idx][2]));
      next();
    } else {
      // console.log(funcs[idx].name + " " + JSON.stringify(context));
      funcs[idx](context, function (moveForward) {
        if (typeof moveForward === "undefined" || moveForward === true) {
          idx += 1;
          next();
        }
      });
    }
  })();
}

Q.if = function (condition, one, two) {
  if (!Array.isArray(one)) one = [one];
  if (!Array.isArray(two)) two = [two];
  return [condition, one, two];
};

/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PARAMETER_REGEXP": () => /* binding */ PARAMETER_REGEXP,
/* harmony export */   "WILDCARD_REGEXP": () => /* binding */ WILDCARD_REGEXP,
/* harmony export */   "REPLACE_VARIABLE_REGEXP": () => /* binding */ REPLACE_VARIABLE_REGEXP,
/* harmony export */   "REPLACE_WILDCARD": () => /* binding */ REPLACE_WILDCARD,
/* harmony export */   "START_BY_SLASH_REGEXP": () => /* binding */ START_BY_SLASH_REGEXP,
/* harmony export */   "MATCH_REGEXP_FLAGS": () => /* binding */ MATCH_REGEXP_FLAGS
/* harmony export */ });
var PARAMETER_REGEXP = /([:*])(\w+)/g;
var WILDCARD_REGEXP = /\*/g;
var REPLACE_VARIABLE_REGEXP = "([^/]+)";
var REPLACE_WILDCARD = "(?:.*)";
var START_BY_SLASH_REGEXP = "(?:/^|^)";
var MATCH_REGEXP_FLAGS = "";

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Navigo
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _Q__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Q */ "./src/Q.ts");


function Navigo(r) {
  var root = "/";
  var current = null;
  var routes = [];
  var notFoundRoute;
  var destroyed = false;
  var genericHooks;
  var self = this;
  var isPushStateAvailable = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pushStateAvailable)();
  var isWindowAvailable = typeof window !== "undefined";
  var lifecycle = [_checkForAlreadyHook, _checkForLeaveHook, _checkForBeforeHook, _callHandler, _checkForAfterHook];
  var notFoundLifeCycle = [_checkForNotFoundHandler, _Q__WEBPACK_IMPORTED_MODULE_1__.default.if(function (_ref) {
    var notFoundHandled = _ref.notFoundHandled;
    return notFoundHandled;
  }, lifecycle, _errorOut)];

  if (!r) {
    console.warn('Navigo requires a root path in its constructor. If not provided will use "/" as default.');
  } else {
    root = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.clean)(r);
  } // functions that are part of Q (queue) processing


  function _required(obj, fields) {
    for (var i = 0; i < fields.length; i++) {
      if (typeof obj[fields[i]] === "undefined") {
        throw new Error("Navigo internal error. Required field \"" + fields[i] + "\" is missing in a queue context.");
      }
    }
  }

  function _checkForLeaveHook(context, done) {
    if (current && current.route.hooks && current.route.hooks.leave) {
      current.route.hooks.leave(function (moveForward) {
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
      context.route.hooks.before(function (moveForward) {
        if (typeof moveForward === "undefined" || moveForward === true) {
          done();
        }
      }, context.match);
    } else {
      done();
    }
  }

  function _callHandler(context, done) {
    _required(context, ["route", "match", "options"]);

    if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.undefinedOrTrue)(context.options, "updateState")) {
      current = context.match;
    }

    if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.undefinedOrTrue)(context.options, "callHandler")) {
      context.route.handler(context.match);
    }

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

    if (current && current.route === context.route && current.url === context.match.url && current.queryString === context.match.queryString) {
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

      var _extractGETParameters = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.extractGETParameters)(context.currentLocationPath),
          url = _extractGETParameters[0],
          queryString = _extractGETParameters[1];

      notFoundRoute.path = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.clean)(url);
      context.match = {
        url: notFoundRoute.path,
        queryString: queryString,
        data: null,
        route: notFoundRoute,
        params: queryString !== "" ? (0,_utils__WEBPACK_IMPORTED_MODULE_0__.parseQuery)(queryString) : null
      };
      context.route = notFoundRoute;
    }

    done();
  }

  function _errorOut(context, done) {
    _required(context, ["currentLocationPath"]);

    console.warn("Navigo: \"" + context.currentLocationPath + "\" didn't match any of the registered routes.");
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

    for (var i = 0; i < routes.length; i++) {
      var route = routes[i];
      var match = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.matchRoute)(context.currentLocationPath, route);

      if (match) {
        context.match = match;
        context.route = route;
        done();
        return;
      }
    }

    done();
  }

  function _checkForDeprecationMethods(context, done) {
    if (context.options) {
      if (typeof context.options["shouldResolve"] !== "undefined") {
        console.warn("\"shouldResolve\" is deprecated. Please check the documentation.");
      }

      if (typeof context.options["silent"] !== "undefined") {
        console.warn("\"silent\" is deprecated. Please check the documentation.");
      }
    }

    done();
  }

  function _checkForForceOp(context, done) {
    _required(context, ["options"]);

    if (context.options.force === true) {
      self.current = current = pathToMatchObject(context.to);
      done(false);
    } else {
      done();
    }
  }

  function _updateBrowserURL(context, done) {
    _required(context, ["to", "options"]);

    context.to = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.clean)(root) + "/" + (0,_utils__WEBPACK_IMPORTED_MODULE_0__.clean)(context.to);

    if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.undefinedOrTrue)(context.options, "updateBrowserURL")) {
      if (isPushStateAvailable) {
        history[context.options.historyAPIMethod || "pushState"](context.options.stateObj || {}, context.options.title || "", ("/" + context.to).replace(/\/\//g, "/") // making sure that we don't have two slashes
        );
      } else if (isWindowAvailable) {
        window.location.href = context.to;
      }
    }

    done();
  } // public APIs


  function createRoute(path, handler, hooks, name) {
    path = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isString)(path) ? (0,_utils__WEBPACK_IMPORTED_MODULE_0__.clean)(root + "/" + (0,_utils__WEBPACK_IMPORTED_MODULE_0__.clean)(path)) : path;
    return {
      name: name || String(path),
      path: path,
      handler: handler,
      hooks: hooks
    };
  }

  function getCurrentEnvURL() {
    if (isWindowAvailable) {
      return location.pathname + location.search + location.hash;
    }

    return root;
  }

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
          routes.push(createRoute(p, _handler, _hooks || genericHooks, name));
        }
      });
      return this;
    } else if (typeof path === "function") {
      hooks = handler;
      handler = path;
      path = root;
    }

    routes.push(createRoute(path, handler, hooks || genericHooks));
    return this;
  }

  function resolve(currentLocationPath) {
    var context = {
      currentLocationPath: currentLocationPath,
      options: {}
    };
    (0,_Q__WEBPACK_IMPORTED_MODULE_1__.default)([_setLocationPath, _findAMatch, _Q__WEBPACK_IMPORTED_MODULE_1__.default.if(function (_ref2) {
      var match = _ref2.match;
      return match;
    }, lifecycle, notFoundLifeCycle)], context);
    return context.match ? context.match : false;
  }

  function navigate(to, options) {
    if (options === void 0) {
      options = {};
    }

    var context = {
      to: to,
      options: options,
      currentLocationPath: to
    };
    (0,_Q__WEBPACK_IMPORTED_MODULE_1__.default)([_checkForDeprecationMethods, _checkForForceOp, _findAMatch, _Q__WEBPACK_IMPORTED_MODULE_1__.default.if(function (_ref3) {
      var match = _ref3.match;
      return match;
    }, lifecycle, notFoundLifeCycle), _updateBrowserURL], context);
  }

  function off(what) {
    this.routes = routes = routes.filter(function (r) {
      if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isString)(what)) {
        return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.clean)(r.path) !== (0,_utils__WEBPACK_IMPORTED_MODULE_0__.clean)(what);
      } else if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isFunction)(what)) {
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
    notFoundRoute = createRoute("/", handler, hooks || genericHooks, "__NOT_FOUND__");
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
            var u = new URL(location);
            location = u.pathname + u.search;
          }

          var options = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.parseNavigateToOptions)(link.getAttribute("data-navigo-options"));

          if (!destroyed) {
            e.preventDefault();
            self.navigate((0,_utils__WEBPACK_IMPORTED_MODULE_0__.clean)(location), options);
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

  function link(path) {
    return "/" + root + "/" + (0,_utils__WEBPACK_IMPORTED_MODULE_0__.clean)(path);
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
    var _extractGETParameters2 = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.extractGETParameters)((0,_utils__WEBPACK_IMPORTED_MODULE_0__.clean)(path)),
        url = _extractGETParameters2[0],
        queryString = _extractGETParameters2[1];

    var params = queryString === "" ? null : (0,_utils__WEBPACK_IMPORTED_MODULE_0__.parseQuery)(queryString);
    var route = createRoute(url, function () {}, genericHooks, url);
    return {
      url: url,
      queryString: queryString,
      route: route,
      data: null,
      params: params
    };
  }

  function directMatch(path) {
    var context = {
      currentLocationPath: path,
      options: {}
    };

    _findAMatch(context, function () {});

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
  this.extractGETParameters = _utils__WEBPACK_IMPORTED_MODULE_0__.extractGETParameters;
  this.lastResolved = lastResolved;
  this.generate = generate;
  this.getLinkPath = getLinkPath;
  this.match = directMatch;
  this._pathToMatchObject = pathToMatchObject;
  this._clean = _utils__WEBPACK_IMPORTED_MODULE_0__.clean;
  listen.call(this);
  updatePageLinks.call(this);
}

/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clean": () => /* binding */ clean,
/* harmony export */   "isString": () => /* binding */ isString,
/* harmony export */   "isFunction": () => /* binding */ isFunction,
/* harmony export */   "regExpResultToParams": () => /* binding */ regExpResultToParams,
/* harmony export */   "extractGETParameters": () => /* binding */ extractGETParameters,
/* harmony export */   "parseQuery": () => /* binding */ parseQuery,
/* harmony export */   "matchRoute": () => /* binding */ matchRoute,
/* harmony export */   "pushStateAvailable": () => /* binding */ pushStateAvailable,
/* harmony export */   "undefinedOrTrue": () => /* binding */ undefinedOrTrue,
/* harmony export */   "parseNavigateToOptions": () => /* binding */ parseNavigateToOptions
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");

function clean(s) {
  return s.split("#")[0].replace(/\/+$/, "").replace(/^\/+/, "");
}
function isString(s) {
  return typeof s === "string";
}
function isFunction(s) {
  return typeof s === "function";
}
function regExpResultToParams(match, names) {
  if (names.length === 0) return null;
  if (!match) return null;
  return match.slice(1, match.length).reduce(function (params, value, index) {
    if (params === null) params = {};
    params[names[index]] = decodeURIComponent(value);
    return params;
  }, null);
}
function extractGETParameters(url) {
  var tmp = clean(url).split(/\?(.*)?$/);
  return [clean(tmp[0]), tmp.slice(1).join("")];
}
function parseQuery(queryString) {
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
function matchRoute(currentPath, route) {
  var _extractGETParameters = extractGETParameters(clean(currentPath)),
      current = _extractGETParameters[0],
      GETParams = _extractGETParameters[1];

  var params = GETParams === "" ? null : parseQuery(GETParams);
  var paramNames = [];
  var pattern;

  if (isString(route.path)) {
    pattern = _constants__WEBPACK_IMPORTED_MODULE_0__.START_BY_SLASH_REGEXP + clean(route.path).replace(_constants__WEBPACK_IMPORTED_MODULE_0__.PARAMETER_REGEXP, function (full, dots, name) {
      paramNames.push(name);
      return _constants__WEBPACK_IMPORTED_MODULE_0__.REPLACE_VARIABLE_REGEXP;
    }).replace(_constants__WEBPACK_IMPORTED_MODULE_0__.WILDCARD_REGEXP, _constants__WEBPACK_IMPORTED_MODULE_0__.REPLACE_WILDCARD) + "$";

    if (clean(route.path) === "") {
      if (clean(current) === "") {
        return {
          url: current,
          queryString: GETParams,
          route: route,
          data: null,
          params: params
        };
      }
    }
  } else {
    pattern = route.path;
  }

  var regexp = new RegExp(pattern, _constants__WEBPACK_IMPORTED_MODULE_0__.MATCH_REGEXP_FLAGS);
  var match = current.match(regexp);

  if (match) {
    var data = isString(route.path) ? regExpResultToParams(match, paramNames) : match.slice(1);
    return {
      url: current,
      queryString: GETParams,
      route: route,
      data: data,
      params: params
    };
  }

  return false;
}
function pushStateAvailable() {
  return !!(typeof window !== "undefined" && window.history && window.history.pushState);
}
function undefinedOrTrue(obj, key) {
  return typeof obj[key] === "undefined" || obj[key] === true;
}
function parseNavigateToOptions(source) {
  if (!source) return {};
  var pairs = source.split(",");
  var options = {};
  pairs.forEach(function (str) {
    var temp = str.split(":").map(function (v) {
      return v.replace(/(^ +| +$)/g, "");
    });

    switch (temp[0]) {
      case "historyAPIMethod":
        options.historyAPIMethod = temp[1];
        break;

      case "updateBrowserURL":
      case "callHandler":
      case "updateState":
      case "force":
        options[temp[0]] = temp[1] === "true";
        break;
    }
  });
  return options;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/index.ts");
/******/ })()
.default;
});
//# sourceMappingURL=Navigo.js.map