"use strict";

exports.__esModule = true;
exports.default = checkForDeprecationMethods;

function checkForDeprecationMethods(context, done) {
  if (context.navigateOptions) {
    if (typeof context.navigateOptions["shouldResolve"] !== "undefined") {
      console.warn("\"shouldResolve\" is deprecated. Please check the documentation.");
    }

    if (typeof context.navigateOptions["silent"] !== "undefined") {
      console.warn("\"silent\" is deprecated. Please check the documentation.");
    }
  }

  done();
}

module.exports = exports.default;