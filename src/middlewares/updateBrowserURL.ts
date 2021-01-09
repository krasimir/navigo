import { undefinedOrTrue, pushStateAvailable, windowAvailable } from "../utils";
import { QContext } from "../../index";

const isWindowAvailable = windowAvailable();
const isPushStateAvailable = pushStateAvailable();

export default function updateBrowserURL(context: QContext, done) {
  if (undefinedOrTrue(context.navigateOptions, "updateBrowserURL")) {
    const value = `${context.to}`.replace(/\/\//g, "/"); // making sure that we don't have two slashes
    const isItUsingHash =
      isWindowAvailable &&
      context.resolveOptions &&
      context.resolveOptions.hash === true;
    if (isPushStateAvailable) {
      history[context.navigateOptions.historyAPIMethod || "pushState"](
        context.navigateOptions.stateObj || {},
        context.navigateOptions.title || "",
        isItUsingHash ? `#${value}` : value
      );
      // This is to solve a nasty bug where the page doesn't scroll to the anchor.
      // We set a microtask to update the hash only.
      if (location && location.hash) {
        setTimeout(() => {
          let tmp = location.hash;
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
