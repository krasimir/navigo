import { QContext } from "../../index";
import Q from "../Q";
import { undefinedOrTrue } from "../utils";

export default function checkForLeaveHook(context: QContext, done) {
  const instance = context.instance;
  if (!instance.lastResolved()) {
    done();
    return;
  }
  Q(
    [
      ...instance.lastResolved().map((oldMatch) => {
        return (_, leaveLoopDone) => {
          // no leave hook
          if (!oldMatch.route.hooks || !oldMatch.route.hooks.leave) {
            leaveLoopDone();
            return;
          }
          // no match or different path or callHooks=false
          if (
            undefinedOrTrue(context.navigateOptions, "callHooks") &&
            (!context.match ||
              !instance.matchLocation(
                oldMatch.route.path as string,
                context.match.url
              ))
          ) {
            Q(
              oldMatch.route.hooks.leave
                .map((f) => {
                  // just so we match the Q interface
                  return (_, d) => f(d, context.match);
                })
                .concat([() => leaveLoopDone()])
            );
            return;
          } else {
            leaveLoopDone();
          }
        };
      }),
    ],
    {},
    () => done()
  );
}
