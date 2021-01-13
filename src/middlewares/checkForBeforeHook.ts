import { QContext } from "../../index";
import Q from "../Q";
import { undefinedOrTrue } from "../utils";

export default function checkForBeforeHook(context: QContext, done) {
  if (
    context.match.route.hooks &&
    context.match.route.hooks.before &&
    undefinedOrTrue(context.navigateOptions, "callHooks")
  ) {
    Q(
      context.match.route.hooks.before
        .map((f) => {
          // just so we match the Q interface
          return function beforeHookInternal(_, d) {
            return f(d, context.match);
          };
        })
        .concat([() => done()])
    );
  } else {
    done();
  }
}
