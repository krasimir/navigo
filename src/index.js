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
    var handler, isRegExp;
    var currentURL = current ? current : window.location.href;
    var m = match(currentURL, this._routes);

    if (m) {
      handler = m.route.handler;
      isRegExp = m.route.route instanceof RegExp;
      if (handler && typeof handler === 'function') {
        if (isRegExp) {
          handler(...(m.match.slice(1, m.match.length)));
        } else {
          handler(m.params);
        }
      }
      return m;
    }
    return false;
  }
}
