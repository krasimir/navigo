/******/ (function(modules) { // webpackBootstrap
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

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _URLParse = __webpack_require__(1);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var isHistorySupported = function isHistorySupported() {
	  return !!(window && window.history && window.history.pushState);
	};
	
	var Navigo = (function () {
	  function Navigo() {
	    _classCallCheck(this, Navigo);
	
	    this._routes = [];
	  }
	
	  _createClass(Navigo, [{
	    key: 'navigate',
	    value: function navigate() {
	      var path = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	
	      if (isHistorySupported) {
	        history.pushState(null, null, this._root + (0, _URLParse.clean)(path));
	      }
	    }
	  }, {
	    key: 'on',
	    value: function on(route) {
	      var handler = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	
	      if (typeof route === 'function') {
	        handler = route;
	        route = '';
	      }
	      this._routes.push({ route: route, handler: handler });
	      return this;
	    }
	  }, {
	    key: 'check',
	    value: function check() {
	      var current = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	
	      var currentURL = current ? current : window.location.href;
	      var match = (0, _URLParse.parse)(currentURL, this._routes.map(function (r) {
	        return r.route;
	      }));
	
	      if (match) {
	        this._routes[match.index].handler(match.params);
	      }
	    }
	  }]);
	
	  return Navigo;
	})();
	
	exports.default = Navigo;
	
	global.Navigo = Navigo;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.clean = clean;
	exports.parse = parse;
	var PARAMETER_REGEXP = /([:*])(\w+)/g;
	var REPLACE_VARIABLE_REGEXP = '([^\/]+)';
	
	function clean(s) {
	  return s.replace(/\/$/, '').replace(/^\//, '');
	};
	
	var urlToParams = function urlToParams(names, match) {
	  if (names.length === 0) return null;
	  if (!match) return null;
	  return match.slice(1, match.length).reduce(function (params, value, index) {
	    params[names[index]] = value;
	    return params;
	  }, {});
	};
	
	function parse(url) {
	  var patterns = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	
	  var defaultResult = {
	    params: null,
	    fullURL: clean(url),
	    index: null
	  };
	
	  return patterns.map(function (p, index) {
	    var paramNames = [],
	        match;
	
	    p = p.replace(PARAMETER_REGEXP, function (full, dots, name) {
	      paramNames.push(name);
	      return REPLACE_VARIABLE_REGEXP;
	    });
	    match = url.match(new RegExp(clean(p)));
	    return match ? {
	      params: urlToParams(paramNames, match),
	      fullURL: match ? clean(url.substr(0, match.index)) : defaultResult.fullURL,
	      index: index
	    } : false;
	  }).filter(function (m) {
	    return m;
	  })[0] || defaultResult;
	};

/***/ }
/******/ ]);
//# sourceMappingURL=navigo.js.map