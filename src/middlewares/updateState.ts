import { QContext } from "../../index";
import { undefinedOrTrue } from "../utils";

export default function updateState(context: QContext, done: () => void) {
  const { navigateOptions, instance, matches } = context;

  if (undefinedOrTrue(navigateOptions, "updateState")) {
    instance._setCurrent(matches);
  }

  // We call the next function in the middleware chain with a delay, to give
  // time for the state to be updated in the browser's history API. This is
  // necessary to prevent the `_matchRoute` function from being called with
  // the old state in certain scenarios, such as when using the back button
  // or when navigating to the same URL twice in a row.
  setTimeout(() => {
    done();
  }, 10);
}
