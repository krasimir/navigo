export type Route = {
  name: string;
  path: string | RegExp;
  handler: Handler;
  hooks: RouteHooksStorage;
};
export type Handler = (match?: Match) => void;
export type Match = {
  url: string;
  queryString: string;
  hashString: string;
  route: Route;
  data: { [key: string]: string } | null;
  params: { [key: string]: string } | null;
};
export type BeforeHook = (done: Function, match: Match) => void;
export type AfterHook = (match: Match) => void;
export type LeaveHook = (done: Function, match: Match | Match[]) => void;
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
  callHooks?: boolean;
  updateState?: boolean;
  force?: boolean;
  resolveOptions?: ResolveOptions;
};
export type ResolveStrategy = "ONE" | "ALL";
export type ResolveOptions = {
  strategy?: ResolveStrategy;
  hash?: boolean;
  noMatchWarning?: boolean;
};
export type QContext = {
  currentLocationPath: string;
  to: string;
  instance: Navigo;
  matches?: Match[];
  match?: Match;
  navigateOptions?: NavigateOptions;
  resolveOptions?: ResolveOptions;
  notFoundHandled?: boolean;
};
export type GenerateOptions = {
  includeRoot: boolean;
};
export type RouterOptions = ResolveOptions & { linksSelector?: string };
declare class Navigo {
  constructor(root: string, options?: RouterOptions);
  root: string;
  routes: Route[];
  destroyed: boolean;
  current: null | Match[];
  lastResolved(): null | Match[];
  on(f: Handler, hooks?: RouteHooks): Navigo;
  on(map: Object, hooks?: RouteHooks): Navigo;
  on(path: string | RegExp, f: Handler, hooks?: RouteHooks): Navigo;
  off(path: string | RegExp): Navigo;
  off(handler: Function): Navigo;
  navigate(to: string, options?: NavigateOptions): void;
  navigateByName(
    name: string,
    data?: Object,
    options?: NavigateOptions
  ): boolean;
  resolve(path?: string, resolveOptions?: ResolveOptions): false | Match;
  destroy(): void;
  notFound(handler: Function, hooks?: RouteHooks): Navigo;
  updatePageLinks(): Navigo;
  link(path: string): string;
  generate(name: string, data?: Object, options?: GenerateOptions): string;
  hooks(hooks: RouteHooks): Navigo;
  getLinkPath(link: Object): string;
  match(path: string): false | Match[];
  matchLocation(
    path: string | RegExp,
    currentLocation?: string,
    annotatePathWithRoot?: boolean
  ): false | Match;
  getCurrentLocation(): Match;
  addBeforeHook(route: Route | string, hookFunction: Function): Function;
  addAfterHook(route: Route | string, hookFunction: Function): Function;
  addAlreadyHook(route: Route | string, hookFunction: Function): Function;
  addLeaveHook(route: Route | string, hookFunction: Function): Function;
  getRoute(nameOrHandler: string | Function): Route | undefined;
  _pathToMatchObject(path: string): Match;
  _clean(path: string): string;
  _setCurrent(current: Match[]): void;
  _checkForAHash(path: string): string;
  _notFoundRoute: Route;
  __freezeListening: boolean;
  __dirty: boolean;
  __waiting: Function[];
  __markAsClean: Function;
}

export default Navigo;
