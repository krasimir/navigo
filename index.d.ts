export type Route = {
  name: string;
  path: string | RegExp;
  handler: Function;
  hooks: RouteHooksStorage;
};
export type Match = {
  url: string;
  queryString: string;
  route: Route;
  data: Object | null;
  params: Object | null;
};
export type BeforeHook = (done: Function, match: Match) => void;
export type AfterHook = (match: Match) => void;
export type LeaveHook = (done: Function, match: Match) => void;
export type AlreadyHook = (match: Match) => void;
export type RouteHooks = {
  before?: BeforeHook;
  after?: AfterHook;
  leave?: LeaveHook;
  already?: AlreadyHook;
};
export type RouteHooksStorage = {
  before?: BeforeHook[];
  after?: AfterHook[];
  leave?: LeaveHook[];
  already?: AlreadyHook[];
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
  hash?: boolean;
  noMatchWarning?: boolean;
};
export type QContext = {
  instance: Navigo;
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
  root: string;
  routes: Route[];
  destroyed: boolean;
  current: null | Match[];
  lastResolved(): null | Match[];
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
  getCurrentLocation(): Match;
  addBeforeHook(route: Route | string, hookFunction: Function): Function;
  addAfterHook(route: Route | string, hookFunction: Function): Function;
  addAlreadyHook(route: Route | string, hookFunction: Function): Function;
  addLeaveHook(route: Route | string, hookFunction: Function): Function;
  getRoute(name: string): Router | undefined;
  _pathToMatchObject(path: string): Match;
  _clean(path: string): string;
  _setCurrent(current: Match[]): void;
  _checkForAHash(path: string): string;
  _notFoundRoute: Route;
}

export default Navigo;
