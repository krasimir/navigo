import Q from "../Q";
import { undefinedOrTrue } from "../utils";
export default function checkForBeforeHook(context, done) {
  if (context.match.route.hooks && context.match.route.hooks.before && undefinedOrTrue(context.navigateOptions, "callHooks")) {
    Q(context.match.route.hooks.before.map(function (f) {
      // just so we match the Q interface
      return function beforeHookInternal(_, d) {
        return f(function (shouldStop) {
          if (shouldStop === false) {
            context.instance.__markAsClean(context);
          } else {
            d();
          }
        }, context.match);
      };
    }).concat([function () {
      return done();
    }]));
  } else {
    done();
  }
}