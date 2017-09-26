function isPushStateAvailable() {
  return !!(
    typeof window !== 'undefined' &&
    window.history &&
    window.history.pushState
  );
}

function Navigo(r, useHash, hash) {
  this.root = null;
  this._routes = [];
  this._paused = false;
  this._destroyed = false;
  this._lastRouteResolved = null;
  this._notFoundHandler = null;
  this._defaultHandler = null;
  this._usePushState = useHash !== true && isPushStateAvailable();
  this._useHash = !this._usePushState;
  this._hash = typeof hash === 'undefined' ? '#' : hash;
  this._onLocationChange = this._onLocationChange.bind(this);
  this._genericHooks = null;
  this._historyAPIUpdateMethod = 'pushState';

  if (r) {
    this.root = useHash ? r.replace(/\/$/, '/' + this._hash) : r.replace(/\/$/, '');
  } else if (useHash) {
    this.root = this._cLoc().split(this._hash)[0].replace(/\/$/, '/' + this._hash);
  }

  this._listen();
  this.updatePageLinks();
}

function clean(s) {
  if (s instanceof RegExp) return s;
  return s.replace(/\/+$/, '').replace(/^\/+/, '^/');
}

function regExpResultToParams(match, names) {
  if (names.length === 0) return null;
  if (!match) return null;
  return match
    .slice(1, match.length)
    .reduce((params, value, index) => {
      if (params === null) params = {};
      params[names[index]] = decodeURIComponent(value);
      return params;
    }, null);
}

function replaceDynamicURLParts(route) {
  var paramNames = [], regexp;

  if (route instanceof RegExp) {
    regexp = route;
  } else {
    regexp = new RegExp(
      route.replace(Navigo.PARAMETER_REGEXP, function (full, dots, name) {
        paramNames.push(name);
        return Navigo.REPLACE_VARIABLE_REGEXP;
      })
      .replace(Navigo.WILDCARD_REGEXP, Navigo.REPLACE_WILDCARD) + Navigo.FOLLOWED_BY_SLASH_REGEXP
    , Navigo.MATCH_REGEXP_FLAGS);
  }
  return { regexp, paramNames };
}

function getUrlDepth(url) {
  return url.replace(/\/$/, '').split('/').length;
}

function compareUrlDepth(urlA, urlB) {
  return getUrlDepth(urlB) - getUrlDepth(urlA);
}

function findMatchedRoutes(url, routes = []) {
  return routes
    .map(route => {
      var { regexp, paramNames } = replaceDynamicURLParts(clean(route.route));
      var match = url.replace(/^\/+/, '/').match(regexp);
      var params = regExpResultToParams(match, paramNames);

      return match ? { match, route, params } : false;
    })
    .filter(m => m);
}

function match(url, routes) {
  return findMatchedRoutes(url, routes)[0] || false;
}

function root(url, routes) {
  var matched = routes.map(
    route => route.route === '' || route.route === '*' ? url : url.split(new RegExp(route.route + '($|\/)'))[0]
  );
  var fallbackURL = clean(url);

  if (matched.length > 1) {
    return matched.reduce((result, url) => {
      if (result.length > url.length) result = url;
      return result;
    }, matched[0]);
  } else if (matched.length === 1) {
    return matched[0];
  }
  return fallbackURL;
}

function isHashChangeAPIAvailable() {
  return !!(
    typeof window !== 'undefined' &&
    'onhashchange' in window
  );
}

function extractGETParameters(url) {
  return url.split(/\?(.*)?$/).slice(1).join('');
}

function getOnlyURL(url, useHash, hash) {
  var onlyURL = url.split(/\?(.*)?$/)[0], split;

  if (typeof hash === 'undefined') {
    // To preserve BC
    hash = '#';
  }

  if (isPushStateAvailable() && !useHash) {
    onlyURL = onlyURL.split(hash)[0];
  } else {
    split = onlyURL.split(hash);
    onlyURL = split.length > 1 ? onlyURL.split(hash)[1] : split[0];
  }

  return onlyURL;
}

function manageHooks(handler, hooks, params) {
  if (hooks && typeof hooks === 'object') {
    if (hooks.before) {
      hooks.before((shouldRoute = true) => {
        if (!shouldRoute) return;
        handler();
        hooks.after && hooks.after(params);
      }, params);
    } else if (hooks.after) {
      handler();
      hooks.after && hooks.after(params);
    }
    return;
  }
  handler();
};

function isHashedRoot(url, useHash, hash) {
  if (isPushStateAvailable() && !useHash) {
    return false;
  }

  if (!url.match(hash)) {
    return false;
  }

  let split = url.split(hash);

  if (split.length < 2 || split[1] === '') {
    return true;
  }

  return false;
};

Navigo.prototype = {
  helpers: {
    match,
    root,
    clean
  },
  navigate: function (path, absolute) {
    var to;

    path = path || '';
    if (this._usePushState) {
      to = (!absolute ? this._getRoot() + '/' : '') + path.replace(/^\/+/, '/');
      to = to.replace(/([^:])(\/{2,})/g, '$1/');
      history[this._historyAPIUpdateMethod]({}, '', to);
      this.resolve();
    } else if (typeof window !== 'undefined') {
      path = path.replace(new RegExp('^' + this._hash), '');
      window.location.href =
        window.location.href
          .replace(/#$/, '')
          .replace(new RegExp(this._hash + '.*$'), '') + this._hash + path;
    }
    return this;
  },
  on: function (...args) {
    if (typeof args[0] === 'function') {
      this._defaultHandler = { handler: args[0], hooks: args[1] };
    } else if (args.length >= 2) {
      if (args[0] === '/') {
        let func = args[1];

        if (typeof args[1] === 'object') {
          func = args[1].uses;
        }

        this._defaultHandler = { handler: func, hooks: args[2] };
      } else {
        this._add(args[0], args[1], args[2]);
      }
    } else if (typeof args[0] === 'object') {
      let orderedRoutes = Object.keys(args[0]).sort(compareUrlDepth);

      orderedRoutes.forEach(route => {
        this.on(route, args[0][route]);
      });
    }
    return this;
  },
  off: function (handler) {
    if (this._defaultHandler !== null && handler === this._defaultHandler.handler) {
      this._defaultHandler = null;
    } else if (this._notFoundHandler !== null && handler === this._notFoundHandler.handler) {
      this._notFoundHandler = null;
    }
    this._routes = this._routes.reduce((result, r) => {
      if (r.handler !== handler) result.push(r);
      return result;
    }, []);
    return this;
  },
  notFound: function (handler, hooks) {
    this._notFoundHandler = { handler, hooks: hooks };
    return this;
  },
  resolve: function (current) {
    var handler, m;
    var url = (current || this._cLoc()).replace(this._getRoot(), '');

    if (this._useHash) {
      url = url.replace(new RegExp('^\/' + this._hash), '/');
    }

    let GETParameters = extractGETParameters(current || this._cLoc());
    let onlyURL = getOnlyURL(url, this._useHash, this._hash);

    if (this._paused) return false;

    if (
        this._lastRouteResolved &&
        onlyURL === this._lastRouteResolved.url &&
        GETParameters === this._lastRouteResolved.query
    ) {
      if (this._lastRouteResolved.hooks && this._lastRouteResolved.hooks.already) {
        this._lastRouteResolved.hooks.already(this._lastRouteResolved.params);
      }
      return false;
    }

    m = match(onlyURL, this._routes);

    if (m) {
      this._callLeave();
      this._lastRouteResolved = {
        url: onlyURL,
        query: GETParameters,
        hooks: m.route.hooks,
        params: m.params,
        name: m.route.name
      };
      handler = m.route.handler;
      manageHooks(() => {
        manageHooks(() => {
          m.route.route instanceof RegExp ?
            handler(...(m.match.slice(1, m.match.length))) :
            handler(m.params, GETParameters);
        }, m.route.hooks, m.params, this._genericHooks);
      }, this._genericHooks, m.params);
      return m;
    } else if (this._defaultHandler && (
        onlyURL === '' ||
        onlyURL === '/' ||
        onlyURL === this._hash ||
        isHashedRoot(onlyURL, this._useHash, this._hash)
    )) {
      manageHooks(() => {
        manageHooks(() => {
          this._callLeave();
          this._lastRouteResolved = { url: onlyURL, query: GETParameters, hooks: this._defaultHandler.hooks };
          this._defaultHandler.handler(GETParameters);
        }, this._defaultHandler.hooks);
      }, this._genericHooks);
      return true;
    } else if (this._notFoundHandler) {
      manageHooks(() => {
        manageHooks(() => {
          this._callLeave();
          this._lastRouteResolved = { url: onlyURL, query: GETParameters, hooks: this._notFoundHandler.hooks };
          this._notFoundHandler.handler(GETParameters);
        }, this._notFoundHandler.hooks);
      }, this._genericHooks);
    }
    return false;
  },
  destroy: function () {
    this._routes = [];
    this._destroyed = true;
    clearTimeout(this._listeningInterval);
    if (typeof window !== 'undefined') {
      window.removeEventListener('popstate', this._onLocationChange);
      window.removeEventListener('hashchange', this._onLocationChange);
    }
  },
  updatePageLinks: function () {
    var self = this;

    if (typeof document === 'undefined') return;

    this._findLinks().forEach(link => {
      if (!link.hasListenerAttached) {
        link.addEventListener('click', function (e) {
          var location = self.getLinkPath(link);

          if (!self._destroyed) {
            e.preventDefault();
            self.navigate(location.replace(/\/+$/, '').replace(/^\/+/, '/'));
          }
        });
        link.hasListenerAttached = true;
      }
    });
  },
  generate: function (name, data = {}) {
    var result = this._routes.reduce((result, route) => {
      var key;

      if (route.name === name) {
        result = route.route;
        for (key in data) {
          result = result.toString().replace(':' + key, data[key]);
        }
      }
      return result;
    }, '');

    return this._useHash ? this._hash + result : result;
  },
  link: function (path) {
    return this._getRoot() + path;
  },
  pause: function (status = true) {
    this._paused = status;
    if (status) {
      this._historyAPIUpdateMethod = 'replaceState';
    } else {
      this._historyAPIUpdateMethod = 'pushState';
    }
  },
  resume: function () {
    this.pause(false);
  },
  historyAPIUpdateMethod: function (value) {
    if (typeof value === 'undefined') return this._historyAPIUpdateMethod;
    this._historyAPIUpdateMethod = value;
    return value;
  },
  disableIfAPINotAvailable: function () {
    if (!isPushStateAvailable()) {
      this.destroy();
    }
  },
  lastRouteResolved() {
    return this._lastRouteResolved;
  },
  getLinkPath(link) {
    return link.pathname || link.getAttribute('href');
  },
  hooks(hooks) {
    this._genericHooks = hooks;
  },
  _add: function (route, handler = null, hooks = null) {
    if (typeof route === 'string') {
      route = encodeURI(route);
    }
    if (typeof handler === 'object') {
      this._routes.push({
        route,
        handler: handler.uses,
        name: handler.as,
        hooks: hooks || handler.hooks
      });
    } else {
      this._routes.push({ route, handler, hooks: hooks });
    }
    return this._add;
  },
  _getRoot: function () {
    if (this.root !== null) return this.root;
    this.root = root(this._cLoc().split('?')[0], this._routes);
    return this.root;
  },
  _listen: function () {
    if (this._usePushState) {
      window.addEventListener('popstate', this._onLocationChange);
    } else if (isHashChangeAPIAvailable()) {
      window.addEventListener('hashchange', this._onLocationChange);
    } else {
      let cached = this._cLoc(), current, check;

      check = () => {
        current = this._cLoc();
        if (cached !== current) {
          cached = current;
          this.resolve();
        }
        this._listeningInterval = setTimeout(check, 200);
      };
      check();
    }
  },
  _cLoc: function () {
    if (typeof window !== 'undefined') {
      if (typeof window.__NAVIGO_WINDOW_LOCATION_MOCK__ !== 'undefined') {
        return window.__NAVIGO_WINDOW_LOCATION_MOCK__;
      }
      return clean(window.location.href);
    }
    return '';
  },
  _findLinks: function () {
    return [].slice.call(document.querySelectorAll('[data-navigo]'));
  },
  _onLocationChange: function () {
    this.resolve();
  },
  _callLeave() {
    if (this._lastRouteResolved && this._lastRouteResolved.hooks && this._lastRouteResolved.hooks.leave) {
      this._lastRouteResolved.hooks.leave();
    }
  }
};

Navigo.PARAMETER_REGEXP = /([:*])(\w+)/g;
Navigo.WILDCARD_REGEXP = /\*/g;
Navigo.REPLACE_VARIABLE_REGEXP = '([^\/]+)';
Navigo.REPLACE_WILDCARD = '(?:.*)';
Navigo.FOLLOWED_BY_SLASH_REGEXP = '(?:\/$|$)';
Navigo.MATCH_REGEXP_FLAGS = '';

export default Navigo;
