"use strict";

exports.__esModule = true;
exports.default = _setLocationPath;

var _utils = require("../utils");

function _setLocationPath(context, done) {
  if (typeof context.currentLocationPath === "undefined") {
    context.currentLocationPath = (0, _utils.getCurrentEnvURL)(context.instance.root);
  }

  context.currentLocationPath = context.instance._checkForAHash(context.currentLocationPath);
  done();
}

module.exports = exports.default;