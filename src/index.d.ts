type Route = {
  path: string;
  handler: Function;
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
  current: Match;
  routes: Route[];
  on(f: Function): Navigo;
  on(map: Object): Navigo;
  on(path: string, f: Function): Navigo;
  off(path: string): Navigo;
  off(handler: Function): Navigo;
  navigate(to: string): void;
  resolve(path?: string): false | Match;
  destroy(): void;
  notFound(handler: Function): Navigo;
  _matchRoute(currentPath: string, route: Route): false | Match;
  _clean(path: string): string;
}
