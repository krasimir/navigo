"use strict";

exports.__esModule = true;
exports.default = _checkForAfterHook;

function _checkForAfterHook(context, done) {
  if (context.match.route.hooks && context.match.route.hooks.after) {
    context.match.route.hooks.after.forEach(function (f) {
      return f(context.match);
    });
  }

  done();
}

module.exports = exports.default;