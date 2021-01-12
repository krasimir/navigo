"use strict";

exports.__esModule = true;
exports.default = checkForNotFoundHandler;

var _utils = require("../utils");

function checkForNotFoundHandler(context, done) {
  var notFoundRoute = context.instance._notFoundRoute;

  if (notFoundRoute) {
    context.notFoundHandled = true;

    var _extractGETParameters = (0, _utils.extractGETParameters)(context.currentLocationPath),
        url = _extractGETParameters[0],
        queryString = _extractGETParameters[1];

    notFoundRoute.path = (0, _utils.clean)(url);
    var notFoundMatch = {
      url: notFoundRoute.path,
      queryString: queryString,
      data: null,
      route: notFoundRoute,
      params: queryString !== "" ? (0, _utils.parseQuery)(queryString) : null
    };
    context.matches = [notFoundMatch];
    context.match = notFoundMatch;
  }

  done();
}

module.exports = exports.default;