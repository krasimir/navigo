"use strict";

exports.__esModule = true;
exports.default = matchPathToRegisteredRoutes;

var _utils = require("../utils");

function matchPathToRegisteredRoutes(context, done) {
  for (var i = 0; i < context.instance.routes.length; i++) {
    var route = context.instance.routes[i];
    var match = (0, _utils.matchRoute)(context.currentLocationPath, route);

    if (match) {
      if (!context.matches) context.matches = [];
      context.matches.push(match);

      if (context.resolveOptions.strategy === "ONE") {
        done();
        return;
      }
    }
  }

  done();
}

module.exports = exports.default;