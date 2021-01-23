import { undefinedOrTrue, pushStateAvailable, windowAvailable } from "../utils";
var isWindowAvailable = windowAvailable();
var isPushStateAvailable = pushStateAvailable();
export default function updateBrowserURL(context, done) {
  if (undefinedOrTrue(context.navigateOptions, "updateBrowserURL")) {
    var value = ("/" + context.to).replace(/\/\//g, "/"); // making sure that we don't have two slashes

    var isItUsingHash = isWindowAvailable && context.resolveOptions && context.resolveOptions.hash === true;

    if (isPushStateAvailable) {
      history[context.navigateOptions.historyAPIMethod || "pushState"](context.navigateOptions.stateObj || {}, context.navigateOptions.title || "", isItUsingHash ? "#" + value : value); // This is to solve a nasty bug where the page doesn't scroll to the anchor.
      // We set a microtask to update the hash only.

      if (location && location.hash) {
        context.instance.__freezeListening = true;
        setTimeout(function () {
          var tmp = location.hash;
          location.hash = "";
          location.hash = tmp;
          context.instance.__freezeListening = false;
        }, 1);
      }
    } else if (isWindowAvailable) {
      window.location.href = context.to;
    }
  }

  done();
}