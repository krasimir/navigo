"use strict";

exports.__esModule = true;
exports.default = checkForLeaveHook;

var _Q = _interopRequireDefault(require("../Q"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkForLeaveHook(context, done) {
  var instance = context.instance;

  if (!instance.lastResolved()) {
    done();
    return;
  }

  (0, _Q.default)([].concat(instance.lastResolved().map(function (oldMatch) {
    return function (_, leaveLoopDone) {
      // no leave hook
      if (!oldMatch.route.hooks || !oldMatch.route.hooks.leave) {
        leaveLoopDone();
        return;
      } // no match or different path or callHooks=false


      if ((0, _utils.undefinedOrTrue)(context.navigateOptions, "callHooks") && (!context.match || !instance.matchLocation(oldMatch.route.path, context.match.url))) {
        (0, _Q.default)(oldMatch.route.hooks.leave.map(function (f) {
          // just so we match the Q interface
          return function (_, d) {
            return f(d, context.match);
          };
        }).concat([function () {
          return leaveLoopDone();
        }]));
        return;
      } else {
        leaveLoopDone();
      }
    };
  })), {}, function () {
    return done();
  });
}

module.exports = exports.default;