import { matchRoute } from "../utils";
export default function matchPathToRegisteredRoutes(context, done) {
  for (var i = 0; i < context.instance.routes.length; i++) {
    var route = context.instance.routes[i];
    var match = matchRoute(context, route);

    if (match) {
      if (!context.matches) context.matches = [];
      context.matches.push(match);

      if (context.resolveOptions.strategy === "ONE") {
        done();
        return;
      }
    }
  }

  done();
}