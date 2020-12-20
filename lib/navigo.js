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

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Navigo
/* harmony export */ });
var PARAMETER_REGEXP = /([:*])(\w+)/g;
var WILDCARD_REGEXP = /\*/g;
var REPLACE_VARIABLE_REGEXP = "([^/]+)";
var REPLACE_WILDCARD = "(?:.*)";
var FOLLOWED_BY_SLASH_REGEXP = "(?:/$|$)";
var MATCH_REGEXP_FLAGS = "";

function clean(s) {
  return s.replace(/\/+$/, "").replace(/^\/+/, "");
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
  var tmp = url.split(/\?(.*)?$/);
  return [tmp[0], tmp.slice(1).join("")];
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

  var paramNames = [];
  var regexp = new RegExp(clean(route.path).replace(PARAMETER_REGEXP, function (full, dots, name) {
    paramNames.push(name);
    return REPLACE_VARIABLE_REGEXP;
  }).replace(WILDCARD_REGEXP, REPLACE_WILDCARD) + FOLLOWED_BY_SLASH_REGEXP, MATCH_REGEXP_FLAGS);
  var match = current.match(regexp);

  if (match) {
    return {
      url: current,
      queryString: GETParams,
      route: route,
      data: regExpResultToParams(match, paramNames),
      params: GETParams === "" ? null : parseQuery(GETParams)
    };
  }

  return false;
}

function pushStateAvailable() {
  return !!(typeof window !== "undefined" && window.history && window.history.pushState);
}

function Navigo(r) {
  var root = "/";
  var current = null;
  var routes = [];
  var notFoundHandler;
  var destroyed = false;
  var isPushStateAvailable = pushStateAvailable();
  var isWindowAvailable = typeof window !== "undefined";

  if (!r) {
    console.warn('Navigo requires a root path in its constructor. If not provided will use "/" as default.');
  } else {
    root = clean(r);
  }

  function getCurrentEnvURL() {
    if (isWindowAvailable) {
      return location.pathname + location.search + location.hash;
    }

    return root;
  }

  function on(path, handler) {
    var _this = this;

    if (typeof path === "object") {
      Object.keys(path).forEach(function (p) {
        return _this.on(p, path[p]);
      });
      return this;
    } else if (typeof handler === "undefined") {
      handler = path;
      path = root;
    }

    routes.push({
      path: clean(path),
      handler: handler
    });
    return this;
  }

  function resolve(currentLocationPath) {
    if (typeof currentLocationPath === "undefined") {
      currentLocationPath = getCurrentEnvURL();
    }

    for (var i = 0; i < routes.length; i++) {
      var match = matchRoute(currentLocationPath, routes[i]);

      if (match) {
        if (current && current.route === routes[i] && current.url === match.url && current.queryString === match.queryString) {
          return false;
        }

        current = match;
        routes[i].handler(match);
        updatePageLinks();
        return match;
      }
    }

    if (notFoundHandler) {
      var _extractGETParameters2 = extractGETParameters(currentLocationPath),
          url = _extractGETParameters2[0],
          queryString = _extractGETParameters2[1];

      notFoundHandler({
        url: url,
        queryString: queryString,
        data: null,
        route: null,
        params: parseQuery(queryString)
      });
      updatePageLinks();
      return true;
    }

    console.warn("Navigo: \"" + currentLocationPath + "\" didn't match any of the registered routes.");
    return false;
  }

  function off(what) {
    if (typeof what === "string") {
      this.routes = routes = routes.filter(function (r) {
        return r.path !== what;
      });
    } else {
      this.routes = routes = routes.filter(function (r) {
        return r.handler !== what;
      });
    }

    return this;
  }

  function navigate(to, options) {
    if (options === void 0) {
      options = {};
    }

    to = clean(root) + "/" + clean(to);

    if (isPushStateAvailable) {
      history[options.historyAPIMethod || "pushState"](options.stateObj || {}, options.title || "", to);
    } else if (isWindowAvailable) {
      window.location.href = to;
    }

    resolve();
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

  function notFound(handler) {
    notFoundHandler = handler;
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

  this.destroyed = destroyed;
  this.routes = routes;
  this.on = on;
  this.off = off;
  this.resolve = resolve;
  this.navigate = navigate;
  this.destroy = destroy;
  this.notFound = notFound;
  this.updatePageLinks = updatePageLinks;
  this._matchRoute = matchRoute;
  this._clean = clean;
  listen.call(this);
  updatePageLinks.call(this);
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