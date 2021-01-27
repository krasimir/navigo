import { QContext, Match } from "../../index";
import {
  parseQuery,
  extractGETParameters,
  clean,
  extractHashFromURL,
} from "../utils";

export default function checkForNotFoundHandler(context: QContext, done) {
  const notFoundRoute = context.instance._notFoundRoute;
  if (notFoundRoute) {
    context.notFoundHandled = true;
    const [url, queryString] = extractGETParameters(
      context.currentLocationPath
    );
    const hashString = extractHashFromURL(context.to);
    notFoundRoute.path = clean(url);
    const notFoundMatch: Match = {
      url: notFoundRoute.path,
      queryString,
      hashString,
      data: null,
      route: notFoundRoute,
      params: queryString !== "" ? parseQuery(queryString) : null,
    };
    context.matches = [notFoundMatch];
    context.match = notFoundMatch;
  }
  done();
}
