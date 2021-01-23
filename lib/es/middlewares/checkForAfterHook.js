import { undefinedOrTrue } from "../utils";
export default function checkForAfterHook(context, done) {
  if (context.match.route.hooks && context.match.route.hooks.after && undefinedOrTrue(context.navigateOptions, "callHooks")) {
    context.match.route.hooks.after.forEach(function (f) {
      return f(context.match);
    });
  }

  done();
}