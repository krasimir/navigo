"use strict";

exports.__esModule = true;
exports.notFoundLifeCycle = exports.foundLifecycle = void 0;

var _Q = _interopRequireDefault(require("./Q"));

var _checkForLeaveHook = _interopRequireDefault(require("./middlewares/checkForLeaveHook"));

var _checkForBeforeHook = _interopRequireDefault(require("./middlewares/checkForBeforeHook"));

var _callHandler = _interopRequireDefault(require("./middlewares/callHandler"));

var _checkForAfterHook = _interopRequireDefault(require("./middlewares/checkForAfterHook"));

var _checkForAlreadyHook = _interopRequireDefault(require("./middlewares/checkForAlreadyHook"));

var _checkForNotFoundHandler = _interopRequireDefault(require("./middlewares/checkForNotFoundHandler"));

var _errorOut = _interopRequireDefault(require("./middlewares/errorOut"));

var _flushCurrent = _interopRequireDefault(require("./middlewares/flushCurrent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var foundLifecycle = [_checkForAlreadyHook.default, _checkForLeaveHook.default, _checkForBeforeHook.default, _callHandler.default, _checkForAfterHook.default];
exports.foundLifecycle = foundLifecycle;
var notFoundLifeCycle = [_checkForNotFoundHandler.default, _Q.default.if(function (_ref) {
  var notFoundHandled = _ref.notFoundHandled;
  return notFoundHandled;
}, foundLifecycle, [_errorOut.default, _checkForLeaveHook.default]), _flushCurrent.default];
exports.notFoundLifeCycle = notFoundLifeCycle;