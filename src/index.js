import { match, root, clean } from './helpers/URLParse';

export default class Navigo {

  constructor(root = null) {
    this._routes = [];
    this._root = root;
    this._isHistorySupported = !!(
      typeof window !== 'undefined' &&
      window.history &&
      window.history.pushState
    );
    this._listenForURLChanges();
  }

  navigate(path = '', absolute = false) {
    if (this._isHistorySupported) {
      history.pushState(
        {},
        '',
        (!absolute ? this._getRoot() + '/' : '') + clean(path)
      );
    }
    this.check();
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
    var handler;
    var m = match(current || this._getCurrentWindowLocation(), this._routes);

    if (m) {
      handler = m.route.handler;
      m.route.route instanceof RegExp ?
        handler(...(m.match.slice(1, m.match.length))) :
        handler(m.params);
      return m;
    }
    return false;
  }

  _getRoot() {
    if (this._root !== null) return this._root;
    this._root = root(this._getCurrentWindowLocation(), this._routes);
    return this._root;
  }

  _listenForURLChanges() {
    if (this._isHistorySupported) {
      window.onpopstate = event => {
        this.check();
      };
    }
  }

  _getCurrentWindowLocation() {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  }
}

