import { QContext } from "../../index";
import { undefinedOrTrue } from "../utils";

export default function _checkForAfterHook(context: QContext, done) {
  if (
    context.match.route.hooks &&
    context.match.route.hooks.after &&
    undefinedOrTrue(context.navigateOptions, "callHooks")
  ) {
    context.match.route.hooks.after.forEach((f) => f(context.match));
  }
  done();
}
