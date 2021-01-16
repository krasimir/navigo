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
        const someOfTheLastOnesMatch = context.matches
          ? context.matches.find((match) => {
              return oldMatch.route.path === match.route.path;
            })
          : false;
        if (
          undefinedOrTrue(context.navigateOptions, "callHooks") &&
          !someOfTheLastOnesMatch
        ) {
          Q(
            oldMatch.route.hooks.leave
              .map((f) => {
                // just so we match the Q interface
                return (_, d) =>
                  f(
                    d,
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
