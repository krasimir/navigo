import { QContext } from "../../index";

export default function _checkForAfterHook(context: QContext, done) {
  if (context.match.route.hooks && context.match.route.hooks.after) {
    context.match.route.hooks.after.forEach((f) => f(context.match));
  }
  done();
}
