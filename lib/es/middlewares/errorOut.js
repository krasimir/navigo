"use strict";

exports.__esModule = true;
exports.default = errorOut;

function errorOut(context, done) {
  if (!context.resolveOptions || context.resolveOptions.noMatchWarning === false || typeof context.resolveOptions.noMatchWarning === "undefined") console.warn("Navigo: \"" + context.currentLocationPath + "\" didn't match any of the registered routes.");
  done();
}

module.exports = exports.default;