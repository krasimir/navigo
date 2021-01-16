import Q from "../Q";
import { undefinedOrTrue } from "../utils";
export default function checkForLeaveHook(context, done) {
  var instance = context.instance;

  if (!instance.lastResolved()) {
    done();
    return;
  }

  Q(instance.lastResolved().map(function (oldMatch) {
    return function (_, leaveLoopDone) {
      // no leave hook
      if (!oldMatch.route.hooks || !oldMatch.route.hooks.leave) {
        leaveLoopDone();
        return;
      }

      var someOfTheLastOnesMatch = context.matches ? context.matches.find(function (match) {
        return oldMatch.route.path === match.route.path;
      }) : false;

      if (undefinedOrTrue(context.navigateOptions, "callHooks") && !someOfTheLastOnesMatch) {
        Q(oldMatch.route.hooks.leave.map(function (f) {
          // just so we match the Q interface
          return function (_, d) {
            return f(d, context.matches && context.matches.length > 0 ? context.matches.length === 1 ? context.matches[0] : context.matches : undefined);
          };
        }).concat([function () {
          return leaveLoopDone();
        }]));
        return;
      } else {
        leaveLoopDone();
      }
    };
  }), {}, function () {
    return done();
  });
}