import { parse, clean } from './helpers/URLParse';

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
    var match = parse(currentURL, this._routes);
    var handler;

    if (match) {
      handler = this._routes[match.index];
      handler ? handler(match.params) : null;
      return match;
    }
    return false;
  }
}

global.Navigo = Navigo;
