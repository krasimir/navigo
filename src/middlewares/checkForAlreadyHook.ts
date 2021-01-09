import { QContext } from "../../index";

export default function checkForAlreadyHook(context: QContext, done) {
  const current = context.instance.lastResolved();
  if (
    current &&
    current[0] &&
    current[0].route === context.match.route &&
    current[0].url === context.match.url &&
    current[0].queryString === context.match.queryString
  ) {
    current.forEach((c) => {
      if (c.route.hooks && c.route.hooks.already) {
        c.route.hooks.already.forEach((f) => f(context.match));
      }
    });
    done(false);
    return;
  }
  done();
}
