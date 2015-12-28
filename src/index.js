import { match, root, clean } from './helpers/URLParse';

const isHistorySupported = function () {
  return !!(window && window.history && window.history.pushState);
};

export default class Navigo {

  constructor() {
    this._routes = [];
  }

  navigate(path = '') {
    if (isHistorySupported) {
      history.pushState(null, null, this._root + clean(path));
    }
  }

  on(route, handler = null) {
    if (typeof route === 'function') {
      handler = route;
      route = '';
    }
    this._routes.push({ route, handler });
    return this;
  }

  check(current) {
    var currentURL = current ? current : window.location.href;
    var matchedRoute = match(currentURL, this._routes);
    var handler;

    if (matchedRoute) {
      handler = matchedRoute.route.handler;
      handler && typeof handler === 'function' ? handler(matchedRoute.params) : null;
      return matchedRoute;
    }
    return false;
  }
}

global.Navigo = Navigo;
