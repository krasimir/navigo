"use strict";

exports.__esModule = true;
exports.default = checkForBeforeHook;

var _Q = _interopRequireDefault(require("../Q"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkForBeforeHook(context, done) {
  if (context.match.route.hooks && context.match.route.hooks.before && (0, _utils.undefinedOrTrue)(context.navigateOptions, "callHooks")) {
    (0, _Q.default)(context.match.route.hooks.before.map(function (f) {
      // just so we match the Q interface
      return function beforeHookInternal(_, d) {
        return f(d, context.match);
      };
    }).concat([function () {
      return done();
    }]));
  } else {
    done();
  }
}

module.exports = exports.default;