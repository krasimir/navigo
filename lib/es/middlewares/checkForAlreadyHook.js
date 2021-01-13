"use strict";

exports.__esModule = true;
exports.default = checkForAlreadyHook;

var _utils = require("../utils");

function checkForAlreadyHook(context, done) {
  var current = context.instance.lastResolved();

  if (current && current[0] && current[0].route === context.match.route && current[0].url === context.match.url && current[0].queryString === context.match.queryString) {
    current.forEach(function (c) {
      if (c.route.hooks && c.route.hooks.already) {
        if ((0, _utils.undefinedOrTrue)(context.navigateOptions, "callHooks")) {
          c.route.hooks.already.forEach(function (f) {
            return f(context.match);
          });
        }
      }
    });
    done(false);
    return;
  }

  done();
}

module.exports = exports.default;