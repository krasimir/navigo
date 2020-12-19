type Route = {
  path: String;
  handler: Function;
};

function clean(s: string) {
  return s.replace(/\/+$/, "").replace(/^\/+/, "");
}
function matchRoute(currentPath: string, route: Route) {
  const regexp = new RegExp(clean(route.path as string));
  const match = clean(currentPath).match(regexp);
  if (match) {
    return {};
  }
  return false;
}

export default function Navigo(r?: string) {
  let root: string = "/";
  const routes: Route[] = [];

  if (!r) {
    console.warn(
      'Navigo requires a root path in its constructor. If not provided will use "/" as default.'
    );
  } else {
    root = r;
  }

  function on(path: string | Function | Object, handler?: Function) {
    if (typeof path === "object") {
      Object.keys(path).forEach((p) => this.on(p, path[p]));
      return this;
    } else if (typeof handler === "undefined") {
      handler = path as Function;
      path = root;
    }
    routes.push({ path: clean(path as string), handler });
    return this;
  }
  function resolve(currentLocationPath?: string) {
    if (typeof currentLocationPath !== "undefined") {
      if (typeof window !== "undefined") {
        currentLocationPath = clean(window.location.href);
      } else {
        currentLocationPath = root;
      }
    }
  }

  this.routes = routes;
  this.on = on;
  this.resolve = resolve;
  this._matchRoute = matchRoute;
  this._clean = clean;
}
