const PARAMETER_REGEXP = /([:*])(\w+)/g;
const WILDCARD_REGEXP = /\*/g;
const REPLACE_VARIABLE_REGEXP = '([^\/]+)';
const REPLACE_WILDCARD = '(?:.*)';
const FOLLOWED_BY_SLASH_REGEXP = '(?:\/|$)';

function clean(s) {
  if (s instanceof RegExp) return s;
  return s.replace(/\/+$/, '').replace(/^\/+/, '/');
}

function regExpResultToParams(match, names) {
  if (names.length === 0) return null;
  if (!match) return null;
  return match
    .slice(1, match.length)
    .reduce((params, value, index) => {
      if (params === null) params = {};
      params[names[index]] = value;
      return params;
    }, null);
}

function replaceDynamicURLParts(route) {
  var paramNames = [], regexp;

  if (route instanceof RegExp) {
    regexp = route;
  } else {
    regexp = new RegExp(
      clean(route)
      .replace(PARAMETER_REGEXP, function (full, dots, name) {
        paramNames.push(name);
        return REPLACE_VARIABLE_REGEXP;
      })
      .replace(WILDCARD_REGEXP, REPLACE_WILDCARD) + FOLLOWED_BY_SLASH_REGEXP
    );
  }
  return { regexp, paramNames };
}

function findMatchedRoutes(url, routes = []) {
  return routes
    .map(route => {
      var { regexp, paramNames } = replaceDynamicURLParts(route.route);
      var match = url.match(regexp);
      var params = regExpResultToParams(match, paramNames);

      return match ? { match, route, params } : false;
    })
    .filter(m => m);
}

function match(url, routes) {
  return findMatchedRoutes(url, routes)[0] || false;
}

function root(url, routes) {
  var matched = findMatchedRoutes(
    url,
    routes.filter(route => {
      let u = clean(route.route);

      return u !== '' && u !== '*';
    })
  );
  var fallbackURL = clean(url);

  if (matched.length > 0) {
    return matched
      .map(m => clean(url.substr(0, m.match.index)))
      .reduce((root, current) => {
        return current.length < root.length ? current : root;
      }, fallbackURL);
  }
  return fallbackURL;
}

function Navigo(r, useHash) {
  this._routes = [];
  this.root = useHash && r ? r.replace(/\/$/, '/#') : (r || null);
  this._useHash = useHash;
  this._paused = false;
  this._ok = !useHash && !!(
    typeof window !== 'undefined' &&
    window.history &&
    window.history.pushState
  );
  this._listen();
  this.updatePageLinks();
}

Navigo.prototype = {
  helpers: {
    match,
    root,
    clean
  },
  navigate: function (path, absolute) {
    path = path || '';
    if (this._ok) {
      history.pushState({}, '', (!absolute ? this._getRoot() + '/' : '') + clean(path));
      this.resolve();
    } else if (typeof window !== 'undefined') {
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
    }
    return this;
  },
  on: function (...args) {
    if (args.length >= 2) {
      this._add(args[0], args[1]);
    } else if (typeof args[0] === 'object') {
      for (let route in args[0]) {
        this._add(route, args[0][route]);
      }
    } else if (typeof args[0] === 'function') {
      this._add('', args[0]);
    }
    return this;
  },
  resolve: function (current) {
    var handler, m;
    var url = (current || this._cLoc()).replace(this._getRoot(), '');

    if (this._paused) return false;
    if (this._useHash) {
      url = url.replace(/^\/#/, '/');
    }
    m = match(url, this._routes);

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
  updatePageLinks: function () {
    if (typeof document === 'undefined') return;
    this._findLinks().forEach(link => {
      var noAction = 'javascript:void(0);';
      var location = link.getAttribute('href');

      if (link.getAttribute('data-navigo-set') === '1') return;
      if (location === noAction) { location = link.getAttribute('data-navigo'); }
      link.setAttribute('href', noAction);
      link.setAttribute('data-navigo', location);
      link.setAttribute('data-navigo-set', '1');
      link.addEventListener('click', e => {
        e.preventDefault();
        this.navigate(clean(location));
      });
    });
  },
  generate: function (name, data = {}) {
    return this._routes.reduce((result, route) => {
      var key;

      if (route.name === name) {
        result = route.route;
        for (key in data) {
          result = result.replace(':' + key, data[key]);
        }
      }
      return result;
    }, '');
  },
  link: function (path) {
    return this._getRoot() + path;
  },
  pause: function (status) {
    this._paused = status;
  },
  _add: function (route, handler = null) {
    if (typeof handler === 'object') {
      this._routes.push({ route, handler: handler.uses, name: handler.as });
    } else {
      this._routes.push({ route, handler });
    }
    return this._add;
  },
  _getRoot: function () {
    if (this.root !== null) return this.root;
    this.root = root(this._cLoc(), this._routes);
    return this.root;
  },
  _listen: function () {
    if (this._ok) {
      window.onpopstate = () => {
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
  },
  _findLinks: function () {
    return [].slice.call(document.querySelectorAll('[data-navigo]'));
  }
};

export default Navigo;
