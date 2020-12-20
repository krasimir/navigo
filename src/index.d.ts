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
interface Navigo {
  current: Match;
  routes: Route[];
  on(f: Function): Navigo;
  on(map: Object): Navigo;
  on(path: string, f: Function): Navigo;
  resolve(path?: string): false | Match;
  _matchRoute(currentPath: string, route: Route): false | Match;
  _clean(path: string): string;
}
