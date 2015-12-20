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
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var Navigo = (function () {
	  function Navigo() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    var _ref$root = _ref.root;
	    var root = _ref$root === undefined ? false : _ref$root;
	    var _ref$listen = _ref.listen;
	    var listen = _ref$listen === undefined ? true : _ref$listen;
	
	    _classCallCheck(this, Navigo);
	
	    this._routes = [];
	    this._root = !root ? window.location.href : root;
	
	    if (listen) this.listen();
	  }
	
	  _createClass(Navigo, [{
	    key: 'navigate',
	    value: function navigate() {
	      var path = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	
	      if (this._isHistorySupported()) {
	        history.pushState(null, null, this._root + this._clearSlashes(path));
	      }
	    }
	  }, {
	    key: 'listen',
	    value: function listen() {}
	  }, {
	    key: 'on',
	    value: function on(regex) {
	      var handler = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	
	      if (typeof regex === 'function') {
	        handler = regex;
	        regex = '';
	      }
	      this._routes.push({ regex: regex, handler: handler });
	      return this;
	    }
	  }, {
	    key: '_isHistorySupported',
	    value: function _isHistorySupported() {
	      return !!(window && window.history && window.history.pushState);
	    }
	  }, {
	    key: '_clearSlashes',
	    value: function _clearSlashes(path) {
	      return path.toString().replace(/\/$/, '').replace(/^\//, '');
	    }
	  }]);
	
	  return Navigo;
	})();
	
	exports['default'] = Navigo;
	
	global.Navigo = Navigo;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ]);
//# sourceMappingURL=navigo.js.map