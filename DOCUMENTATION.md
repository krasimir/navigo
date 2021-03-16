# API

| Method                                                              | What it does |
| --------------------------------------------------------------------| -------------|
| | |
| <span style="text-align:center">Frequently used</span> |
| | |
| [`constructor`](#initializing)                                      | 
| [`on`](#adding-a-route)                                             | Registers a route |
| [`navigate`](#navigating-between-routes)                            | Navigates to a route with a change of the browser URL. You usually are calling this as a result of user interaction. You want to change the URL. |
| [`resolve`](#resolving-routes)                                      | Navigates to a route but it doesn't change the browser URL. You should fire this at least one in the beginning. |
| [`notFound`](#handling-a-not-found-page)                            | Defining a not-found handler |
| | |
| <span style="text-align:center">Other methods</span> |
| | |
| [`navigateByName`](#navigating-by-route-name)                       | Navigate to a route by having its name and supplying URL data args |
| [`off`](#removing-a-route)                                          | Removes a registered route |
| [`match`](#direct-matching-of-registered-routes)                    | Checks if the passed path matches some of the routes. It doesn't trigger handlers or hooks. |
| [`matchLocation`](#direct-matching-of-paths)                        | The bare matching logic of Navigo |
| [`destroy`](#destroying-the-router)                                 | Removing the currently registered routes |
| [`updatePageLinks`](#augment-your-a-tags)                           | Call this if you re-render (change the DOM) and want Navigo to recognize the links with `data-navigo` attribute |
| [`link`](#generating-paths)                                         | Constructs a path |
| [`generate`](#generating-paths)                                     | Constructs a path based on a registered route |
| [`lastResolved`](#resolving-routes)                                 | Returns the last resolved route/s |
| [`hooks`](#defining-hooks-for-all-the-routes)                       | Define all-routes hooks |
| [`addBeforeHook`](#adding-a-hook-to-already-defined-route)          | Adding before hook on an already created route |
| [`addAfterHook`](#adding-a-hook-to-already-defined-route)           | Adding after hook on an already created route |
| [`addAlreadyHook`](#adding-a-hook-to-already-defined-route)         | Adding already hook on an already created route |
| [`addLeaveHook`](#adding-a-hook-to-already-defined-route)           | Adding leave hook on an already created route |
| [`getCurrentLocation`](#getting-current-location-of-the-browser)    | Returns a [Match](#match) object for the current browser location |
| [`getRoute`](#getting-access-to-a-route)                            | Get a [Route](#route) by name/path |

# Topics

- [API](#api)
- [Topics](#topics)
  - [Initializing](#initializing)
  - [Adding a route](#adding-a-route)
    - [Parameterized routes](#parameterized-routes)
    - [Reading GET params](#reading-get-params)
    - [Reading hash params](#reading-hash-params)
    - [Matching logic](#matching-logic)
  - [Removing a route](#removing-a-route)
  - [Navigating between routes](#navigating-between-routes)
    - [Navigating by route name](#navigating-by-route-name)
  - [Augment your `<a>` tags](#augment-your-a-tags)
    - [`data-navigo` with value](#data-navigo-with-value)
    - [Custom selector](#custom-selector)
    - [Passing options to the `navigate` method](#passing-options-to-the-navigate-method)
  - [Resolving routes](#resolving-routes)
    - [Resolve options](#resolve-options)
    - [Hash based routing](#hash-based-routing)
  - [Direct matching of registered routes](#direct-matching-of-registered-routes)
  - [Direct matching of paths](#direct-matching-of-paths)
  - [Hooks](#hooks)
    - [Type of hooks](#type-of-hooks)
    - [Defining hooks for specific route](#defining-hooks-for-specific-route)
    - [Defining hooks for all the routes](#defining-hooks-for-all-the-routes)
    - [Adding a hook to already defined route](#adding-a-hook-to-already-defined-route)
  - [Destroying the router](#destroying-the-router)
  - [Generating paths](#generating-paths)
  - [Handling a not-found page](#handling-a-not-found-page)
  - [Getting current location of the browser](#getting-current-location-of-the-browser)
  - [Getting access to a route](#getting-access-to-a-route)
  - [Types](#types)
    - [Navigo](#navigo)
    - [Match](#match)
    - [Route](#route)
    - [RouteHooks](#routehooks)
    - [RouterOptions](#routeroptions)
    - [NavigateOptions](#navigateoptions)
    - [ResolveOptions](#resolveoptions)
    - [GenerateOptions](#generateoptions)

---

Types

| Object                               |
| -------------------------------------|
| [Navigo](#navigo)                    |
| [Match](#match)                      |
| [Route](#route)                      |
| [RouteHooks](#routehooks)            |
| [RouterOptions](#routeroptions)  |
| [NavigateOptions](#navigateoptions)  |
| [ResolveOptions](#resolve-options)   |

## Initializing

Navigo constructor has one mandatory argument - the root path of your application. For example, if you are hosting the application at `https://site.com/my/project` you have to specify the following:

```js
const router = new Navigo('/my/project');
```

The second argument is the default [router options](#routeroptions). The `strategy` field there defines how many matches the router finds - one or many.

```js
const router = new Navigo('/my/project', { strategy: 'ALL' });
```

By default the strategy is equal to `"ONE"`. Meaning that when a match is found the router stops resolving other routes.

Another option available is `noMatchWarning`. Which if you set to `true` will prevent the router of warning a message if there is no matching route.

## Adding a route

```typescript
interface Navigo {
  on(path: string, f: Function, hooks?: RouteHooks): Navigo;
  on(f: Function, hooks?: RouteHooks): Navigo;
  on(map: Object, hooks?: RouteHooks): Navigo;
}
```

To add a route use the `on` method. It can be used in four different ways. The first and the most straightforward one is when you have a path and want to map it to a function.

```js
const router = new Navigo('/');
router.on('/foo/bar', () => {
  // Fired if the page URL matches '/foo/bar'.
});
```

The path in this case could be also a regular expression. For example:

```js
const router = new Navigo('/');
router.on(/foo\/(.*)/, () => {
  // Fired if the page URL matches '/foo/bar'.
});
```

If you skip the path you are basically defining a handler for your root.

```js
const router = new Navigo('/my/app');
router.on(() => {
  // Fired if the page URL matches '/my/app' route.
  // Or in other words the home of your app.
})
```

The `on` method is chainable so you can call `on('...', () => {}).on('...', () => {})` if you want.

The next option is to define a key-value pairs of your routes:

```js
router.on({
  '/foo/bar': () => {
    // Fired if the route matches '/foo/bar'.
  },
  '/foo/zar': () => {
    // Fired if the route matches '/foo/zar'.
  }
});
```

And the most complex one is by giving your route a name (via the `as` field). This could be used in a combination of the [generate](#generating-paths) method to construct a page path or simply to identify what is currently matching.

```js
router.on({
  '/foo/bar': {
    as: 'routeA',
    uses: () => {
       // Fired if the route matches '/foo/bar'.
    }
  }
  '/foo/bar': {
    as: 'routeB',
    uses: () => {
       // Fired if the route matches '/foo/bar'.
    }
  }
})
```

Notice the typing of the `on` method in the beginning of this section and you'll see that you can pass hooks to each route. More about that in the [hooks](#hooks) section.

### Parameterized routes

The parameterized routes have paths that contain dynamic parts. For example:

```js
const router = new Navigo('/');

router.on('/user/:id/:action', ({ data }) => {
  console.log(data); // { id: 'xxx', action: 'save' }
});

router.resolve('/user/xxx/save');
```

`"/user/xxx/save"` matches the defined route. `"xxx"` maps to `id` and `"save"` to `action`. The data from the URL comes into the `data` field of the [Match](#match) object passed to your handler.

Parameterized routes happen also when we use a regular expression as a path. It's just our `data` property comes as an array containing the matched groups.

```js
const router = new Navigo('/');
router.on(/rock\/(.*)\/(.*)/, ({ data }) => {
  console.log(data); // ["paper", "scissors"]
});
router.resolve("/rock/paper/scissors");
```

### Reading GET params

Navigo captures the GET params of the matched routes. For example:

```js
const router = new Navigo('/');

router.on('/user/:id/:action', ({ data, params, queryString }) => {
  console.log(data); // { id: 'xxx', action: 'save' }
  console.log(params); // { m: "n", k: "z" }
  console.log(queryString); // "m=n&k=z"
});

router.resolve('/user/xxx/save?m=n&k=z');
```

### Reading hash params

Navigo captures the hash bit of the URL for the matched routes. For example:

```js
const router = new Navigo('/');

router.on('/foobar', ({ hashString }) => {
  console.log(hashString); // something-else
});

router.resolve('/foobar#something-else');
```

### Matching logic

Navigo relies on regular expressions to match strings against location paths. This logic is abstracted and for the final user we have a simple [DSL](https://en.wikipedia.org/wiki/Domain-specific_language). Here are couple of examples:

```js
router.on('/foo', () => {});
// matches specifically "/foo"

router.on('/foo/:name', () => {});
// matches "/foo/my-name-here"

router.on(':page', () => {});
// matches "/about-page"

router.on('/foo/*', () => {});
// matches "/foo/a/b/c"

router.on('*', () => {});
// matches "/foo/bar/moo"

router.on(/rock\/(.*)\/(.*)/, () => {});
// matches "/rock/paper/scissors"

router.on('/foo/:id/?', () => {});
// matches "/foo/20/save" and also "/foo/20"
```

## Removing a route

```typescript
interface Navigo {
  off(path: string | RegExp): Navigo;
  off(handler: Function): Navigo;
}
```

To remove a route call the `off` method by passing the path (or the used regular expression) or the handler of the route.

## Navigating between routes

```typescript
interface Navigo {
  navigate(to: string, options?: NavigateOptions): void;
}

type NavigateOptions = {
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
```

The `navigate` method by default:

* Checks if there is a match. And if the answer is "yes" then ...
* It calls hooks (if any) and your route handler.
* Updates the internal state of the router.
* Updates the browser URL.

Consider the following example:

```js
const router = new Navigo("/");

router
  .on("/foo/bar", () => {
    console.log('Nope');
  })
  .on("/about", () => {
    console.log('This is About page');
  });

router.navigate("about");
```

After the last line the browser will have in its address bar `/about` as a path and in the console we'll see `"This is About page"`. `router.lastResolved()` and `router.current` will point to an array of a single object of type [Match](#match).

`navigate` accepts a few options:

* `title` is a string that gets passed to `pushState` (or `replaceState`).
* `stateObj` is a state object that gets passed to `pushState` (or `replaceState`).
* If you don't want to have a new entry in the history you should pass `{ historyAPIMethod: 'replaceState' }`. By default is `pushState`.
* If `updateBrowserURL` is set to `false` the library will not use the history API at all. Meaning, the browser URL will not change.
* If `callHandler` is set to `false` your route handler will not be fired.
* If `callHooks` is set to `false` your route hooks will be skipped.
* If `updateState` is set to `false` the router will not update its internal state. This means that the `lastResolved()`/`current` route will not be updated.
* If `force` is set to `true` the router will update its internal state only. This makes the router like it already resolved specific URL.
* `resolveOptions` are the same options used in the [resolve](#resolving-routes) method.

### Navigating by route name

```typescript
interface Navigo {
  navigateByName(name: string, data?:Object, options?: NavigateOptions): boolean;
}
```

Very often we have complex URLs and we want to have a quick way to reach them. `navigateByName` is a method that helps in such cases:

```js
route.on({
  "/users/:name": { 
    as: "user",
    uses: (match) => {
      console.log(match.data.name); // Krasimir
    }
  },
});

router.navigateByName("user", { name: "Krasimir" });
```

`/users/Krasimir` is set in the address bar of the browser and the handler is executed.

The method returns `true` if there is such route with that name (i.e. the navigating happened) and `false` if it doesn't.

## Augment your `<a>` tags

Let's say that we have a page with links (`<a>` tags). The links have `href` attributes pointing to locations inside your app. By default Navigo doesn't know about those links and if you click them you'll probably get a full page load. To augment those links and integrate them with Navigo just add `data-navigo` attribute. For example:

```html
<a href="/company/about" data-navigo>About</a>
```

When Navigo is initialized checks the page for such tags and attaches `click` handler which fires the router's `navigate` method.

Navigo has a method called `updatePageLinks` which you have to call every time when you change the DOM and you expect to see new links on the page. Because Navigo is not wired to a rendering engine doesn't really know about the DOM manipulations. It does though makes an assumption - after each of your route handlers there is a `updatePageLinks` call. The router expects that after the successful route resolving the DOM is updated and calls that function again. Feel free to fire `updatePageLinks` multiple times on the same DOM tree. There will be just one `click` handler attached to your links.

*Links with `target="_blank"` are ignored even if they have `data-navigo` attribute.*

### `data-navigo` with value

If you use `data-navigo="false"` the link will be ignored by Navigo and if there was a click handler for it the handler will be removed.

### Custom selector

If you are not happy with  `data-navigo` attribute you may provide your own CSS selector. You may even say "just augment all the links on the page".

```js
const router = new Navigo("/", { linksSelector: "a" });
```

Example [here](./examples/custom-selector/page.html).

### Passing options to the `navigate` method

As we learned above, when a link with `data-navigo` attribute is clicked the `navigate` method of the router gets executed. That same method accepts options and if you want to pass some of them use the following syntax:

```html
<a href="/foo/bar" data-navigo data-navigo-options="updateBrowserURL:false, callHandler: false, updateState: false, force: false, historyAPIMethod: replaceState, resolveOptionsStrategy: ALL, resolveOptionsHash: true">my link</a>
```

Which will result in the following options:

```js
{
  updateBrowserURL: false,
  callHandler: false,
  updateState: false,
  force: false,
  historyAPIMethod: "replaceState",
  resolveOptions: { strategy: "ALL", hash: true },
}
```

## Resolving routes

```typescript
interface Navigo {
  resolve(path?: string, resolveOptions?: ResolveOptions): false | Match[];
}

export type ResolveOptions = {
  strategy?: ONE | ALL;
  noMatchWarning?: true | false;
};
type Match = {
  url: string;
  queryString: string;
  route: Route;
  data: Object | null;
  params: Object | null;
};
type Route = {
  name: string;
  path: string;
  handler: Function;
  hooks: RouteHooks;
};
```

By default Navigo is not resolving your routes. You have to at least once call `resolve` method. The `path` argument is not mandatory. If you skip it the library will use the current URL of the page. The method is fired automatically in the following cases:

* If there is a `popstate` event dispatched (this happens when the user manually changes the browser location by hitting for example the back button)
* If the `navigate` method is called and `shouldResolve` is not set to `false`

By default the `resolve` function catches the first match and stops searching. You can amend this behavior by passing `"ALL"` as a value of the `strategy` field. However, if there is a matching route you'll get an array of object (or objects) of type [Match](#match). If there is no match then `resolve` returns `false`. When your route gets resolved its handler is called. It receives a [Match](#match) object. From that object you can pull the data passed through the URL (if you used a parameterized path) or the GET params set in the URL.

If you need to see the latest match (or matches) you can access it via the `lastResolved()` method.

`resolve` does the following:

* Checks if there is a match. And if the answer is "yes" then ...
* It calls hooks (if any) and your route handler.
* Updates the internal state of the router.

Another option available is `noMatchWarning`. Which if you set to `true` will prevent the router of warning a message if there is no matching route.

### Resolve options

```typescript
export type ResolveOptions = {
  strategy?: ONE | ALL;
  hash?: boolean;
  noMatchWarning?: true | false;
};
```

* `strategy` - either `"ONE"` (by default) or `"ALL"`.
* `hash` - whether to use hash based routing or not (by default is `false`).
* `noMatchWarning` - `false` (by default) or `true`

### Hash based routing

Navigo supports hash based routing. Which means that it uses the hash string as path for routing. For example `/my/app/#/about/team` is treated as `/about/team`. To enable this mode you have to pass `hash: true` when creating the router.

```js
const router = new Navigo('/', { hash: true });
```

## Direct matching of registered routes

If you want to check if some path is matching any of the routes without triggering hooks, handlers or changing the browser URL you may use the `match` method. For example:

```js
const r: Navigo = new Navigo("/");

r.on("/user/:id", () => {});

console.log(r.match("/nope"));
// result: false

console.log(r.match("/user/xxx/?a=b"));
// result:
// [
//   {
//     data: {
//       id: "xxx",
//     },
//     params: { a: "b" },
//     queryString: "a=b",
//     route: {
//       handler: [Function],
//       hooks: undefined,
//       name: "user/:id",
//       path: "user/:id",
//     },
//     url: "user/xxx",
//   }
// ]
```

The function returns an array of [Match](#match) objects or `false`.

## Direct matching of paths

There is a `matchLocation` method that offers the bare matching logic of the router. You pass a `path` and it checks if the string matches the current location. If you don't want to use the current location of the browser you may send a second argument. For example:

```js
// let's say that the path of the browser is "/foo/bar?a=b"
router.matchLocation('/foo/:id');
/*
{
  data: {
    id: "bar",
  },
  params: { a: "b" },
  queryString: "a=b",
  route: {
    handler: expect.any(Function),
    hooks: {},
    name: "foo/:id",
    path: "foo/:id",
  },
  url: "foo/bar",
}
*/

// passing the current location manually
r.matchLocation("/foo/:id", "/foo/bar?a=b");
```

The method returns false if there is no match.

## Hooks

The _hooks_ are functions that are fired as part of the resolving process. Think about them as lifecycle methods.

### Type of hooks

The hooks object has the following signature:

```typescript
type RouteHooks = {
  before?: (done: Function, match: Match) => void;
  after?: (match: Match) => void;
  leave?: (done: Function, match: Match) => void;
  already?: (match: Match) => void;
};
```

* The `before` hook receives two arguments. The first one is a function that needs to be called with either no arguments or `false`. The no-argument version means "move forward". `false` stops the resolving and your handler will not be called.
* `after` is called after your handler
* `leave` is called when you are about to leave out of the route. Similarly to the `before` hook accepts a function as first argument and a [Match](#match) object (or an array of [Match](#match) objects) as second. If the function is called with `false` Navigo will stop resolving the new matched route meaning "we cant' go out of the current route".
* `already` is called when this is the current route and it matches again

### Defining hooks for specific route

The `on` method accepts a hooks object as a last argument. For example:

```js
// for specific path
router.on('/foo/bar/', () => {...}, {
  before(done, match) {
    // do something
    done();
  }
});

// for the root
router.on(() => {...}, {
  before(done, match) {
    // do something
    done();
  }
});

// when using a route map
r.on({
  "/foo/:id": {
    as: "some.name",
    uses: handler,
    hooks: {
      before: (done) => {
        // do something
        done();
      },
    },
  },
});

// with the notFound method
router.notFound(() => {...}, {
  before(done, match) {
    // do something
    done();
  }
});
```

### Defining hooks for all the routes

You can define hooks that will be used for all the registered routes. It is important to set the hooks before the other route definition.

```js
const router = new Navigo("/");
router.hooks({
  before(done, match) {
    // do something
    done();
  }
});
router.on("/foo/bar", () => {});
router.on("/", () => {});
```

### Adding a hook to already defined route

Sometimes you may need to add a hook to a route later. In such cases use the following syntax:

```js
const router = new Navigo("/");

router.on("/foo/bar", () => {});
const cleanup = router.addBeforeHook('foo/bar', (done) => {
  // my before hook logic
})

// ... some other logic
cleanup();
```

With `addBeforeHook` we have `addAfterHook`, `addAlreadyHook` and `addLeaveHook` methods. All of them return a function which if called will remove the hook from the specific route.

## Destroying the router

```typescript
destroy(): void;
```

If you no longer need Navigo working just call `router.destroy()`. This will flush all the registered routes so nothing will match.

## Generating paths

There are two methods `link` and `generate` that you can use to create string paths. For example:

```js
const router = new Navigo('/my/app');

router.link('blah'); // "/my/app/blah

router.on({
  "/user/:id/:action": { as: "RouteNameHere", uses: () => {} },
});

r.generate("RouteNameHere", { id: "xxx", action: "save" }); // "/my/app/user/xxx/save"
```

Notice that the produced strings by default start with the root that you passed to the Navigo's constructor. If you don't want this behavior pass a third argument to the function `{ includeRoot: false }`. In this case the second argument should be always present. Feel free to pass `null` if you don't have any data.

## Handling a not-found page

```typescript
interface Navigo {
  notFound(handler: Function, hooks?: RouteHooks): Navigo;
}
```

Navigo offers a special handler for the cases where a no match is found.

```js
const router = new Navigo('/');

router.notFound(() => {
  // this runs if there is no match found
});
```

## Getting current location of the browser

`router.getCurrentLocation()` returns the current location of the browser in the format of a [Match](#match) object.

## Getting access to a route

There is `getRoute` method that accepts a route name/path. The object that you receive is of type [Route](#route).

## Types

### Navigo

```typescript
class Navigo {
  constructor(root: string, options?: RouterOptions);
  destroyed: boolean;
  current: Match[];
  routes: Route[];
  on(f: Function, hooks?: RouteHooks): Navigo;
  on(map: Object, hooks?: RouteHooks): Navigo;
  on(path: string | RegExp, f: Function, hooks?: RouteHooks): Navigo;
  off(path: string | RegExp): Navigo;
  off(handler: Function): Navigo;
  navigate(to: string, options?: NavigateOptions): void;
  navigateByName(name: string, data?: Object, options?: NavigateOptions): void;
  resolve(path?: string, resolveOptions?: ResolveOptions): false | Match;
  destroy(): void;
  notFound(handler: Function, hooks?: RouteHooks): Navigo;
  updatePageLinks(): Navigo;
  link(path: string): string;
  lastResolved(): null | Match[];
  generate(name: string, data?: Object, options:? GenerateOptions): string;
  hooks(hooks: RouteHooks): Navigo;
  getLinkPath(link: Object): string;
  match(path: string): false | Match[];
  matchLocation(path: string, currentLocation?: string, annotatePathWithRoot?: boolean): false | Match;
  getCurrentLocation(): Match;
  addBeforeHook(route: Route | string, hookFunction: Function): Function;
  addAfterHook(route: Route | string, hookFunction: Function): Function;
  addAlreadyHook(route: Route | string, hookFunction: Function): Function;
  addLeaveHook(route: Route | string, hookFunction: Function): Function;
  getRoute(name: string): Router | undefined;
}
```

### Match

```typescript
type Match = {
  url: string;
  queryString: string;
  hashString: string;
  route: Route;
  data: Object | null;
  params: Object | null;
};
```

### Route

```typescript
type Route = {
  name: string;
  path: string | RegExp;
  handler: Function;
  hooks: RouteHooks;
};
```

### RouteHooks

```typescript
type RouteHooks = {
  before?: (done: Function, match: Match) => void;
  after?: (match: Match) => void;
  leave?: (done: Function, match: Match | Match[]) => void;
  already?: (match: Match) => void;
};
```

### RouterOptions

```typescript
export type RouterOptions = ResolveOptions & { linksSelector?: string };
```

### NavigateOptions

```typescript
type NavigateOptions = {
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
```

### ResolveOptions

```typescript
export type ResolveOptions = {
  strategy?: ONE | ALL;
  hash?: boolean;
  noMatchWarning?: true | false;
};
```

### GenerateOptions

```typescript
export type GenerateOptions = {
  includeRoot: boolean;
};
```
