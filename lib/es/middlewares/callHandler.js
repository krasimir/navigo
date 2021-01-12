"use strict";

exports.__esModule = true;
exports.default = callHandler;

var _utils = require("../utils");

function callHandler(context, done) {
  if ((0, _utils.undefinedOrTrue)(context.navigateOptions, "updateState")) {
    context.instance._setCurrent(context.matches);
  }

  if ((0, _utils.undefinedOrTrue)(context.navigateOptions, "callHandler")) {
    context.match.route.handler(context.match);
  }

  context.instance.updatePageLinks();
  done();
}

module.exports = exports.default;