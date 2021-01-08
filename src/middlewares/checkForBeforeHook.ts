import { QContext } from "../../index";

export default function checkForBeforeHook(context: QContext, done) {
  if (context.match.route.hooks && context.match.route.hooks.before) {
    context.match.route.hooks.before((moveForward: boolean) => {
      if (typeof moveForward === "undefined" || moveForward === true) {
        done();
      }
    }, context.match);
  } else {
    done();
  }
}
