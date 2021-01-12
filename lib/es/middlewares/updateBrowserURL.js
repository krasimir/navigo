"use strict";

exports.__esModule = true;
exports.default = updateBrowserURL;

var _utils = require("../utils");

var isWindowAvailable = (0, _utils.windowAvailable)();
var isPushStateAvailable = (0, _utils.pushStateAvailable)();

function updateBrowserURL(context, done) {
  if ((0, _utils.undefinedOrTrue)(context.navigateOptions, "updateBrowserURL")) {
    var value = ("/" + context.to).replace(/\/\//g, "/"); // making sure that we don't have two slashes

    var isItUsingHash = isWindowAvailable && context.resolveOptions && context.resolveOptions.hash === true;

    if (isPushStateAvailable) {
      history[context.navigateOptions.historyAPIMethod || "pushState"](context.navigateOptions.stateObj || {}, context.navigateOptions.title || "", isItUsingHash ? "#" + value : value); // This is to solve a nasty bug where the page doesn't scroll to the anchor.
      // We set a microtask to update the hash only.

      if (location && location.hash) {
        setTimeout(function () {
          var tmp = location.hash;
          location.hash = "";
          location.hash = tmp;
        }, 1);
      }
    } else if (isWindowAvailable) {
      window.location.href = context.to;
    }
  }

  done();
}

module.exports = exports.default;