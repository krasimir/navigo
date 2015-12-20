export default class Navigo {
  constructor({ root = false, listen = true } = {}) {
    this._routes = [];
    this._root = !root ? window.location.href : root;

    if (listen) this.listen();
  }

  navigate(path = '') {
    if (this._isHistorySupported()) {
      history.pushState(null, null, this._root + this._clearSlashes(path));
    }
  }

  listen() {

  }

  on(regex, handler = null) {
    if (typeof regex === 'function') {
      handler = regex;
      regex = '';
    }
    this._routes.push({ regex, handler });
    return this;
  }

  _isHistorySupported() {
    return !!(window && window.history && window.history.pushState);
  }

  _clearSlashes(path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  }
}

global.Navigo = Navigo;
