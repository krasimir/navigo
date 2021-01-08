import { QContext } from "../../index";
import Q from "../Q";

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
          // no match or different path
          if (
            !context.match ||
            !instance.matchLocation(
              oldMatch.route.path as string,
              context.match.url
            )
          ) {
            oldMatch.route.hooks.leave((moveForward: boolean) => {
              if (typeof moveForward === "undefined" || moveForward === true) {
                leaveLoopDone();
              }
            }, context.match);
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
