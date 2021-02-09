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
    instance.lastResolved().map((oldMatch) => {
      return (_, leaveLoopDone) => {
        // no leave hook
        if (!oldMatch.route.hooks || !oldMatch.route.hooks.leave) {
          leaveLoopDone();
          return;
        }
        let runHook = false;
        const newLocationVSOldMatch = context.instance.matchLocation(
          oldMatch.route.path,
          context.currentLocationPath
        );
        if (oldMatch.route.path !== "*") {
          runHook = !newLocationVSOldMatch;
        } else {
          const someOfTheLastOnesMatch = context.matches
            ? context.matches.find((match) => {
                return oldMatch.route.path === match.route.path;
              })
            : false;
          runHook = !someOfTheLastOnesMatch;
        }
        if (undefinedOrTrue(context.navigateOptions, "callHooks") && runHook) {
          Q(
            oldMatch.route.hooks.leave
              .map((f) => {
                // just so we match the Q interface
                return (_, d) =>
                  f(
                    (shouldStop) => {
                      if (shouldStop === false) {
                        context.instance.__dirty = false;
                      } else {
                        d();
                      }
                    },
                    context.matches && context.matches.length > 0
                      ? context.matches.length === 1
                        ? context.matches[0]
                        : context.matches
                      : undefined
                  );
              })
              .concat([() => leaveLoopDone()])
          );
          return;
        } else {
          leaveLoopDone();
        }
      };
    }),
    {},
    () => done()
  );
}
