export type Route = {
  name: string;
  path: string | RegExp;
  handler: Function;
  hooks: RouteHooks;
};
export type Match = {
  url: string;
  queryString: string;
  route: Route;
  data: Object | null;
  params: Object | null;
};
export type RouteHooks = {
  before?: (done: Function, match: Match) => void;
  after?: (match: Match) => void;
  leave?: (done: Function, match: Match) => void;
  already?: (match: Match) => void;
};
export type NavigateOptions = {
  title?: string;
  stateObj?: Object;
  historyAPIMethod?: string;
  updateBrowserURL?: boolean;
  callHandler?: boolean;
  updateState?: boolean;
  force?: boolean;
  resolveOptions?: ResolveOptions;
};
export type ResolveOptions = {
  strategy?: ONE | ALL;
  noMatchWarning?: true | false;
};
export type QContext = {
  matches?: Match[];
  match?: Match;
  currentLocationPath?: string;
  to?: string;
  navigateOptions?: NavigateOptions;
  resolveOptions?: ResolveOptions;
  notFoundHandled?: boolean;
};
class Navigo {
  constructor(root: string, resolveOptions?: ResolveOptions);
  destroyed: boolean;
  current: null | Match[];
  lastResolved(): null | Match[];
  routes: Route[];
  on(f: Function, hooks?: RouteHooks): Navigo;
  on(map: Object, hooks?: RouteHooks): Navigo;
  on(path: string | RegExp, f: Function, hooks?: RouteHooks): Navigo;
  off(path: string | RegExp): Navigo;
  off(handler: Function): Navigo;
  navigate(to: string, options?: NavigateOptions): void;
  resolve(path?: string, resolveOptions?: ResolveOptions): false | Match;
  destroy(): void;
  notFound(handler: Function, hooks?: RouteHooks): Navigo;
  updatePageLinks(): Navigo;
  link(path: string): string;
  generate(name: string, data?: Object): string;
  hooks(hooks: RouteHooks): Navigo;
  getLinkPath(link: Object): string;
  match(path: string): false | Match[];
  matchLocation(path: string, currentLocation?: string): false | Match;
  _pathToMatchObject(path: string): Match;
  _clean(path: string): string;
}

export default Navigo;
