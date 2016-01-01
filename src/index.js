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
    this.resolve();
  }

  on(...args) {
    if (args.length === 2) {
      this._addRoute(args[0], args[1]);
    } else if (typeof args[0] === 'object') {
      for (let route in args[0]) {
        this._addRoute(route, args[0][route]);
      }
    } else if (typeof args[0] === 'function') {
      this._addRoute('', args[0]);
    }
    this.resolve();
  }

  resolve(current) {
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

  _addRoute(route, handler = null) {
    this._routes.push({ route, handler });
    return this._addRoute;
  }

  _getRoot() {
    if (this._root !== null) return this._root;
    this._root = root(this._getCurrentWindowLocation(), this._routes);
    return this._root;
  }

  _listenForURLChanges() {
    if (this._isHistorySupported) {
      window.onpopstate = event => {
        this.resolve();
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

