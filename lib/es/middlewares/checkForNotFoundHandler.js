import { parseQuery, extractGETParameters, clean } from "../utils";
export default function checkForNotFoundHandler(context, done) {
  var notFoundRoute = context.instance._notFoundRoute;

  if (notFoundRoute) {
    context.notFoundHandled = true;

    var _extractGETParameters = extractGETParameters(context.currentLocationPath),
        url = _extractGETParameters[0],
        queryString = _extractGETParameters[1];

    notFoundRoute.path = clean(url);
    var notFoundMatch = {
      url: notFoundRoute.path,
      queryString: queryString,
      data: null,
      route: notFoundRoute,
      params: queryString !== "" ? parseQuery(queryString) : null
    };
    context.matches = [notFoundMatch];
    context.match = notFoundMatch;
  }

  done();
}