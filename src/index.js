import { match, root, clean } from './helpers/URLParse';

export default class Navigo {

  constructor(r = null, useHash = false) {
    this._routes = [];
    this._root = r;
    this._isHistorySupported = useHash === false && !!(
      typeof window !== 'undefined' &&
      window.history &&
      window.history.pushState
    );
    this._listenForURLChanges();
  }

  navigate(path = '', absolute = false) {
    if (this._isHistorySupported) {
      history.pushState({}, '', (!absolute ? this._getRoot() + '/' : '') + clean(path));
      this.resolve();
    } else if (typeof window !== 'undefined') {
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
    }
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

  destroy() {
    this._routes = [];
    clearTimeout(this._listenningInterval);
    typeof window !== 'undefined' ? window.onpopstate = null : null;
  }

  get root() {
    return this._getRoot();
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
    } else {
      let cached = this._getCurrentWindowLocation(), current, check;

      check = () => {
        current = this._getCurrentWindowLocation();
        if (cached !== current) {
          cached = current;
          this.resolve();
        }
        this._listenningInterval = setTimeout(check, 200);
      };
      check();
    }
  }

  _getCurrentWindowLocation() {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  }
}

