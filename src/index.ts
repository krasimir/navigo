type Route = {
  path: String;
  handler: Function;
};

export default class Navigo {
  root: string;
  routes: Route[];

  constructor(r) {
    this.routes = [];
    if (!r) {
      console.warn(
        'Navigo requires a root path in its constructor. If not provided will use "/" as default.'
      );
      this.root = "/";
    } else {
      this.root = r;
    }
  }
  on(path: string | Function | Object, handler?: Function) {
    if (typeof path === "object") {
      Object.keys(path).forEach((p) => this.on(p, path[p]));
      return this;
    } else if (typeof handler === "undefined") {
      handler = path as Function;
      path = this.root;
    }
    this.routes.push({ path: path as String, handler });
  }
}
