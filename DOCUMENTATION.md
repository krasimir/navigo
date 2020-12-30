- [Initializing](#initializing)
- [Adding a route](#adding-a-route)
  - [Parameterized routes](#parameterized-routes)
  - [Reading GET params](#reading-get-params)
- [Removing a route](#removing-a-route)
- [Navigating between routes](#navigating-between-routes)
- [Augment your `<a>` tags](#augment-your-a-tags)
  - [Passing options to the `navigate` method](#passing-options-to-the-navigate-method)
- [Resolving routes](#resolving-routes)
- [Direct matching of registered routes](#direct-matching-of-registered-routes)
- [Direct matching of paths](#direct-matching-of-paths)
- [Hooks](#hooks)
  - [Type of hooks](#type-of-hooks)
  - [Defining hooks for specific route](#defining-hooks-for-specific-route)
  - [Defining hooks for all the routes](#defining-hooks-for-all-the-routes)
- [Destroying the router](#destroying-the-router)
- [Generating paths](#generating-paths)
- [Handling a not-found page](#handling-a-not-found-page)
- [Types](#types)
  - [Navigo](#navigo)
  - [Match](#match)
  - [Route](#route)
  - [RouteHooks](#routehooks)
  - [NavigateTo](#navigateto)

---

API

| Method                                           |
| -------------------------------------------------|
| [`constructor`](#initializing)                   |
| [`on`](#adding-a-route)                          |
| [`off`](#removing-a-route)                       |
| [`navigate`](#navigating-between-routes)         |
| [`resolve`](#resolving-routes)                   |
| [`match`](#direct-matching-of-registered-routes) |
| [`matchLocation`](#direct-matching-of-paths)     |
| [`destroy`](#destroying-the-router)              |
| [`notFound`](#handling-a-not-found-page)         |
| [`updatePageLinks`](#augment-your-a-tags)        |
| [`link`](#generating-paths)                      |
| [`generate`](#generating-paths)                  |
| [`lastResolved`](#resolving-routes)              |
| [`hooks`](#defining-hooks-for-all-the-routes)    |

Types

| Object                     |
| ---------------------------|
| [Navigo](#navigo)          |
| [Match](#match)            |
| [Route](#route)            |
| [RouteHooks](#routehooks)  |
| [NavigateTo](#navigateto)  |

## Initializing

Navigo constructor gets a single argument. The root path of your application. For example, let's say that you are hosing your project at `https://site.com/my/project`:

```js
const router = new Navigo('/my/project');
```

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

And the most complex one is by giving your route a name (via the `as` field). This could be used in a combination of the `generate` method to construct a page path or simply to identify what is currently matching.

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

## Removing a route

```typescript
interface Navigo {
  off(path: string): Navigo;
}
```

To remove a route call the `off` method by passing the path.

## Navigating between routes

```typescript
interface Navigo {
  navigate(to: string, options?: NavigateTo): void;
}

type NavigateTo = {
  title?: string;
  stateObj?: Object;
  historyAPIMethod?: string;
  updateBrowserURL?: boolean;
  callHandler?: boolean;
  updateState?: boolean;
  force?: boolean;
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

After the last line the browser will have in its address bar `/about` as a path and in the console we'll see `"This is About page"`. `router.lastResolved()` and `router.current` will point to an object of type [Match](#match).

`navigate` accepts a few options:

* `title` is a string that gets passed to `pushState` (or `replaceState`).
* `stateObj` is a state object that gets passed to `pushState` (or `replaceState`).
* If you don't want to have a new entry in the history you should pass `{ historyAPIMethod: 'replaceState' }`. By default is `pushState`.
* If `updateBrowserURL` is set to `false` the library will not use the history API at all. Meaning, the browser URL will not change.
* If `callHandler` is set to `false` your route handler will not be fired.
* If `updateState` is set to `false` the router will not update its internal state. This means that the `lastResolved()`/`current` route will not be updated.
* If `force` is set to `true` the router will update its internal state only. This makes the router like it already resolved specific URL.

## Augment your `<a>` tags

Let's say that we have a page with links (`<a>` tags). The links have `href` attributes pointing to locations inside your app. By default Navigo doesn't know about those links and if you click them you'll probably get a full page load. To augment those links and integrate them with Navigo just add `data-navigo` attribute. For example:

```html
<a href="/company/about" data-navigo>About</a>
```

When Navigo is initialized checks the page for such tags and attaches `click` handler which fires the router's `navigate` method.

Navigo has a method called `updatePageLinks` which you have to call every time when you change the DOM and you expect to see new links on the page. Because Navigo is not wired to a rendering engine doesn't really know about the DOM manipulations. It does though makes an assumption - after each of your route handlers there is a `updatePageLinks` call. The router expects that after the successful route resolving the DOM is updated and calls that function again. Feel free to fire `updatePageLinks` multiple times on the same DOM tree. There will be just one `click` handler attached to your links.

### Passing options to the `navigate` method

As we learned above, when a link with `data-navigo` attribute is clicked the `navigate` method of the router gets executed. That same method accepts options and if you want to pass some of them use the following syntax:

```html
<a href="/foo/bar" data-navigo data-navigo-options="updateBrowserURL:false, callHandler: false, updateState: false, force: false, historyAPIMethod: replaceState">my link</a>
```

## Resolving routes

```typescript
interface Navigo {
  resolve(path?: string): false | Match;
}

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

By default Navigo is not resolving your routes. You have to at least once call `resolve`. The `path` argument is not mandatory. If you skip it the library will use the current URL of the page. The method is fired automatically in the following cases:

* If there is a `popstate` event dispatched (this happens when the user manually changes the browser location by hitting for example the back button)
* If the `navigate` method is called and `shouldResolve` is not set to `false`

If there is a matching route you'll get an object of type [Match](#match). If not `resolve` returns `false`. When your route gets resolved its handler is called. It receives the same [Match](#match) object. From that object you can pull the data passed through the URL (if you used a parameterized path) or the GET params set in the URL.

If you need to see the latest match you can access it via the `lastResolved()` method.

`resolve` does the following:

* Checks if there is a match. And if the answer is "yes" then ...
* It calls hooks (if any) and your route handler.
* Updates the internal state of the router.

## Direct matching of registered routes

If you want to check if some path is matching any of the routes without triggering hooks, handlers or changing the browser URL you may use the `match` method. For example:

```js
const r: Navigo = new Navigo("/");

r.on("/user/:id", () => {});

console.log(r.match("/nope"));
// result: false

console.log(r.match("/user/xxx/?a=b"));
// result:
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
```

## Direct matching of paths

There is a `matchLocation` method that offers the bare matching logic of the router. You pass a `path` and it checks if the string matches the current location. If you don't want to use the current location of the browser you may send a second argument which will replace it with whatever you send. For example:

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
* `leave` is called when you are about to leave out of the route. Similarly to the `before` hook accepts a function as first argument and a [Match](#match) object as second. If the function is called with `false` Navigo will stop resolving the route.
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

You can define hooks that will be used for all the registered routes. It is important to set the hooks before the route definition.

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

Notice that the produced strings start always with the root that you passed to the Navigo's constructor.

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

## Types

### Navigo

```typescript
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
  match(path: string): false | Match;
  matchLocation(path: string, currentLocation?: string): false | Match;
  _pathToMatchObject(path: string): Match;
  _clean(path: string): string;
}
```

### Match

```typescript
type Match = {
  url: string;
  queryString: string;
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
  leave?: (done: Function, match: Match) => void;
  already?: (match: Match) => void;
};
```

### NavigateTo

```typescript
type NavigateTo = {
  title?: string;
  stateObj?: Object;
  historyAPIMethod?: string;
  updateBrowserURL?: boolean;
  callHandler?: boolean;
  updateState?: boolean;
  force?: boolean;
};
```
