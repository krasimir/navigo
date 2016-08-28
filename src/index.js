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

function isPushStateAvailable() {
  return !!(
    typeof window !== 'undefined' &&
    window.history &&
    window.history.pushState
  );
}

function createRoute({ route, handler, name, hooks }) {
  var fireHooks = function (callback) {
    if (hooks) {
      // having only before hook
      if (hooks.before && !hooks.after) {
        return hooks.before(() => callback());
      }

      // having both hooks
      if (hooks.before && hooks.after) {
        return hooks.before(() => {
          let result = callback();

          hooks.after();
          return result;
        });
      }

      // having only after hook
      if (!hooks.before && hooks.after) {
        let result = callback();

        hooks.after();
        return result;
      }
    } else {
      return callback();
    }
  };

  return {
    fire: function (m) {
      return fireHooks(() => {
        route instanceof RegExp ?
          handler(...(m.match.slice(1, m.match.length))) :
          handler(m ? m.params : null);
      });
    },
    route,
    handler,
    name,
    hooks
  };
}

function Navigo(r, useHash) {
  this._routes = [];
  this.root = useHash && r ? r.replace(/\/$/, '/#') : (r || null);
  this._useHash = useHash;
  this._paused = false;
  this._destroyed = false;
  this._lastRouteResolved = null;
  this._notFoundHandler = null;
  this._defaultHandler = null;
  this._ok = !useHash && isPushStateAvailable();
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
    var to;

    path = path || '';
    if (this._ok) {
      to = (!absolute ? this._getRoot() + '/' : '') + clean(path);
      to = to.replace(/([^:])(\/{2,})/g, '$1/');
      history[this._paused ? 'replaceState' : 'pushState']({}, '', to);
      this.resolve();
    } else if (typeof window !== 'undefined') {
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
    }
    return this;
  },
  on: function (...args) {
    if (args.length === 2) {
      if (typeof args[0] === 'function' && typeof args[1] === 'object') {
        this._defaultHandler = createRoute({ handler: args[0], hooks: args[1] });
      } else {
        this._add(...args);
      }
    } else if (args.length > 2) {
      this._add(...args);
    } else if (typeof args[0] === 'object') {
      for (let route in args[0]) {
        this._add(route, args[0][route]);
      }
    } else if (typeof args[0] === 'function') {
      this._defaultHandler = createRoute({ handler: args[0] });
    }
    return this;
  },
  notFound: function (handler, hooks) {
    this._notFoundHandler = createRoute({ handler, hooks });
  },
  resolve: function (current) {
    var m;
    var url = (current || this._cLoc()).replace(this._getRoot(), '');

    if (this._paused || url === this._lastRouteResolved) return false;
    if (this._useHash) {
      url = url.replace(/^\/#/, '/');
    }
    m = match(url, this._routes);

    if (m) {
      this._lastRouteResolved = url;
      return m.route.fire(m);
    } else if (this._defaultHandler && (url === '' || url === '/')) {
      this._defaultHandler.fire();
      return true;
    } else if (this._notFoundHandler) {
      this._notFoundHandler.fire();
    }
    return false;
  },
  destroy: function () {
    this._routes = [];
    this._destroyed = true;
    clearTimeout(this._listenningInterval);
    typeof window !== 'undefined' ? window.onpopstate = null : null;
  },
  updatePageLinks: function () {
    var self = this;

    if (typeof document === 'undefined') return;

    this._findLinks().forEach(link => {
      if (!link.hasListenerAttached) {
        link.addEventListener('click', function (e) {
          var location = link.getAttribute('href');

          if (!self._destroyed) {
            e.preventDefault();
            self.navigate(clean(location));
          }
        });
        link.hasListenerAttached = true;
      }
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
  disableIfAPINotAvailable: function () {
    if (!isPushStateAvailable()) {
      this.destroy();
    }
  },
  _add: function (route, handler = null, hooks) {
    if (typeof handler === 'object') {
      this._routes.push(createRoute({ route, handler: handler.uses, name: handler.as, hooks }));
    } else {
      this._routes.push(createRoute({ route, handler, hooks }));
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
