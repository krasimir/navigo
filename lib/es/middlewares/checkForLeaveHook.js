import Q from "../Q";
import { undefinedOrTrue } from "../utils";
export default function checkForLeaveHook(context, done) {
  var instance = context.instance;

  if (!instance.lastResolved()) {
    done();
    return;
  }

  Q([].concat(instance.lastResolved().map(function (oldMatch) {
    return function (_, leaveLoopDone) {
      // no leave hook
      if (!oldMatch.route.hooks || !oldMatch.route.hooks.leave) {
        leaveLoopDone();
        return;
      } // no match or different path or callHooks=false


      if (undefinedOrTrue(context.navigateOptions, "callHooks") && (!context.match || !instance.matchLocation(oldMatch.route.path, context.match.url))) {
        Q(oldMatch.route.hooks.leave.map(function (f) {
          // just so we match the Q interface
          return function (_, d) {
            return f(d, context.match);
          };
        }).concat([function () {
          return leaveLoopDone();
        }]));
        return;
      } else {
        leaveLoopDone();
      }
    };
  })), {}, function () {
    return done();
  });
}