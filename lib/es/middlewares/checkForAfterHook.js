"use strict";

exports.__esModule = true;
exports.default = _checkForAfterHook;

var _utils = require("../utils");

function _checkForAfterHook(context, done) {
  if (context.match.route.hooks && context.match.route.hooks.after && (0, _utils.undefinedOrTrue)(context.navigateOptions, "callHooks")) {
    context.match.route.hooks.after.forEach(function (f) {
      return f(context.match);
    });
  }

  done();
}

module.exports = exports.default;