type Route = {
  path: string;
  handler: Function;
  hooks: RouteHooks;
};
type RouteHooks = {
  before?: (done: Function, match: Match) => void;
  after?: (match: Match) => void;
  leave?: (match: Match) => void;
  already?: (match: Match) => void;
};
type Match = {
  url: string;
  queryString: string;
  route: Route;
  data: Object | null;
  params: Object | null;
};
type NavigateTo = {
  title?: string;
  historyAPIMethod?: string;
  stateObj?: Object;
};
interface Navigo {
  destroyed: boolean;
  current: Match;
  routes: Route[];
  on(f: Function, hooks?: RouteHooks): Navigo;
  on(map: Object, hooks?: RouteHooks): Navigo;
  on(path: string, f: Function, hooks?: RouteHooks): Navigo;
  off(path: string): Navigo;
  off(handler: Function): Navigo;
  navigate(to: string): void;
  resolve(path?: string): false | Match;
  destroy(): void;
  notFound(handler: Function, hooks?: RouteHooks): Navigo;
  updatePageLinks(): Navigo;
  link(path: string): string;
  _matchRoute(currentPath: string, route: Route): false | Match;
  _clean(path: string): string;
}
