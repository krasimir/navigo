import { match, root, clean } from './helpers/URLParse';

function Navigo(r, useHash) {
  this._routes = [];
  this.root = r || null;
  this._ok = !useHash && !!(
    typeof window !== 'undefined' &&
    window.history &&
    window.history.pushState
  );
  this._listen();
};

Navigo.prototype = {
  navigate: function (path, absolute) {
    path = path || '';
    if (this._ok) {
      history.pushState({}, '', (!absolute ? this._getRoot() + '/' : '') + clean(path));
      this.resolve();
    } else if (typeof window !== 'undefined') {
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
    }
  },
  on: function (...args) {
    if (args.length === 2) {
      this._add(args[0], args[1]);
    } else if (typeof args[0] === 'object') {
      for (let route in args[0]) {
        this._add(route, args[0][route]);
      }
    } else if (typeof args[0] === 'function') {
      this._add('', args[0]);
    }
    this.resolve();
  },
  resolve: function (current) {
    var handler;
    var m = match(current || this._cLoc(), this._routes);

    if (m) {
      handler = m.route.handler;
      m.route.route instanceof RegExp ?
        handler(...(m.match.slice(1, m.match.length))) :
        handler(m.params);
      return m;
    }
    return false;
  },
  destroy: function () {
    this._routes = [];
    clearTimeout(this._listenningInterval);
    typeof window !== 'undefined' ? window.onpopstate = null : null;
  },
  _add: function (route, handler = null) {
    this._routes.push({ route, handler });
    return this._add;
  },
  _getRoot: function () {
    if (this.root !== null) return this.root;
    this.root = root(this._cLoc(), this._routes);
    return this.root;
  },
  _listen: function () {
    if (this._ok) {
      window.onpopstate = event => {
        this.resolve();
      };
    } else {
      let cached = this._cLoc(), current, check;

      check = () => {
        current = this._cLoc();
        if (cached !== current) {
          cached = current;
          this.resolve();
        }
        this._listenningInterval = setTimeout(check, 200);
      };
      check();
    }
  },
  _cLoc: function () {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  }
};

export default Navigo;
