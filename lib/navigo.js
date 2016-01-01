(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Navigo", [], factory);
	else if(typeof exports === 'object')
		exports["Navigo"] = factory();
	else
		root["Navigo"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _URLParse = __webpack_require__(1);
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Navigo = (function () {
	  function Navigo() {
	    var root = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
	
	    _classCallCheck(this, Navigo);
	
	    this._routes = [];
	    this._root = root;
	    this._isHistorySupported = !!(typeof window !== 'undefined' && window.history && window.history.pushState);
	    this._listenForURLChanges();
	  }
	
	  _createClass(Navigo, [{
	    key: 'navigate',
	    value: function navigate() {
	      var path = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var absolute = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	      if (this._isHistorySupported) {
	        history.pushState({}, '', (!absolute ? this._getRoot() + '/' : '') + (0, _URLParse.clean)(path));
	      }
	      this.resolve();
	    }
	  }, {
	    key: 'on',
	    value: function on() {
	      if (arguments.length === 2) {
	        this._addRoute(arguments[0], arguments[1]);
	      } else if (_typeof(arguments[0]) === 'object') {
	        for (var route in arguments[0]) {
	          this._addRoute(route, arguments[0][route]);
	        }
	      } else if (typeof arguments[0] === 'function') {
	        this._addRoute('', arguments[0]);
	      }
	      this.resolve();
	    }
	  }, {
	    key: 'resolve',
	    value: function resolve(current) {
	      var handler;
	      var m = (0, _URLParse.match)(current || this._getCurrentWindowLocation(), this._routes);
	
	      if (m) {
	        handler = m.route.handler;
	        m.route.route instanceof RegExp ? handler.apply(undefined, _toConsumableArray(m.match.slice(1, m.match.length))) : handler(m.params);
	        return m;
	      }
	      return false;
	    }
	  }, {
	    key: '_addRoute',
	    value: function _addRoute(route) {
	      var handler = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	
	      this._routes.push({ route: route, handler: handler });
	      return this._addRoute;
	    }
	  }, {
	    key: '_getRoot',
	    value: function _getRoot() {
	      if (this._root !== null) return this._root;
	      this._root = (0, _URLParse.root)(this._getCurrentWindowLocation(), this._routes);
	      return this._root;
	    }
	  }, {
	    key: '_listenForURLChanges',
	    value: function _listenForURLChanges() {
	      var _this = this;
	
	      if (this._isHistorySupported) {
	        window.onpopstate = function (event) {
	          _this.check();
	        };
	      }
	    }
	  }, {
	    key: '_getCurrentWindowLocation',
	    value: function _getCurrentWindowLocation() {
	      if (typeof window !== 'undefined') {
	        return window.location.href;
	      }
	      return '';
	    }
	  }]);
	
	  return Navigo;
	})();
	
	exports.default = Navigo;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.clean = clean;
	exports.match = match;
	exports.root = root;
	var PARAMETER_REGEXP = /([:*])(\w+)/g;
	var WILDCARD_REGEXP = /\*/g;
	var REPLACE_VARIABLE_REGEXP = '([^\/]+)';
	var REPLACE_WILDCARD = '(?:.*)';
	var FOLLOWED_BY_SLASH_REGEXP = '(?:\/|$)';
	
	function clean(s) {
	  return s.replace(/\/+$/, '').replace(/^\/+/, '/');
	};
	
	function regExpResultToParams(match, names) {
	  if (names.length === 0) return null;
	  if (!match) return null;
	  return match.slice(1, match.length).reduce(function (params, value, index) {
	    if (params === null) params = {};
	    params[names[index]] = value;
	    return params;
	  }, null);
	};
	
	function replaceDynamicURLParts(route) {
	  var paramNames = [],
	      regexp;
	
	  if (route instanceof RegExp) {
	    regexp = route;
	  } else {
	    regexp = new RegExp(clean(route).replace(PARAMETER_REGEXP, function (full, dots, name) {
	      paramNames.push(name);
	      return REPLACE_VARIABLE_REGEXP;
	    }).replace(WILDCARD_REGEXP, REPLACE_WILDCARD) + FOLLOWED_BY_SLASH_REGEXP);
	  }
	  return { regexp: regexp, paramNames: paramNames };
	};
	
	function findMatchedRoutes(url) {
	  var routes = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	
	  return routes.map(function (route) {
	    var _replaceDynamicURLPar = replaceDynamicURLParts(route.route);
	
	    var regexp = _replaceDynamicURLPar.regexp;
	    var paramNames = _replaceDynamicURLPar.paramNames;
	
	    var match = url.match(regexp);
	    var params = regExpResultToParams(match, paramNames);
	
	    return match ? { match: match, route: route, params: params } : false;
	  }).filter(function (m) {
	    return m;
	  });
	};
	
	function match(url) {
	  var routes = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	
	  return findMatchedRoutes(url, routes)[0] || false;
	};
	
	function root(url) {
	  var routes = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	
	  var matched = findMatchedRoutes(url, routes.filter(function (route) {
	    return clean(route.route) !== '';
	  }));
	  var fallbackURL = clean(url);
	
	  if (matched.length > 0) {
	    return matched.map(function (m) {
	      return clean(url.substr(0, m.match.index));
	    }).reduce(function (root, current) {
	      return current.length < root.length ? current : root;
	    }, fallbackURL);
	  }
	  return fallbackURL;
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=navigo.js.map