type Route = {
  name: string;
  path: string | RegExp;
  handler: Function;
  hooks: RouteHooks;
};
type Match = {
  url: string;
  queryString: string;
  route: Route;
  data: Object | null;
  params: Object | null;
};
type RouteHooks = {
  before?: (done: Function, match: Match) => void;
  after?: (match: Match) => void;
  leave?: (match: Match) => void;
  already?: (match: Match) => void;
};
type NavigateTo = {
  title?: string;
  stateObj?: Object;
  historyAPIMethod?: string;
  shouldResolve?: boolean;
  silent?: boolean;
};
interface Navigo {
  destroyed: boolean;
  current: Match;
  routes: Route[];
  on(f: Function, hooks?: RouteHooks): Navigo;
  on(map: Object, hooks?: RouteHooks): Navigo;
  on(path: string | RegExp, f: Function, hooks?: RouteHooks): Navigo;
  off(path: string | RegExp): Navigo;
  off(handler: Function): Navigo;
  navigate(to: string, options?: NavigateTo): void;
  resolve(path?: string): false | Match;
  destroy(): void;
  notFound(handler: Function, hooks?: RouteHooks): Navigo;
  updatePageLinks(): Navigo;
  link(path: string): string;
  lastResolved(): null | Match;
  generate(name: string, data?: Object): string;
  hooks(hooks: RouteHooks): Navigo;
  getLinkPath(link: Object): string;
  _pathToMatchObject(path: string): Match;
  _matchRoute(currentPath: string, route: Route): false | Match;
  _clean(path: string): string;
}
