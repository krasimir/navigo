import { QContext } from "../../index";
import Q from "../Q";

export default function checkForBeforeHook(context: QContext, done) {
  if (context.match.route.hooks && context.match.route.hooks.before) {
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
