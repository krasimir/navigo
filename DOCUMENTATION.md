# Navigo

- [Navigo](#navigo)
  - [Adding a route](#adding-a-route)
    - [Parameterized routes](#parameterized-routes)
    - [Reading GET params](#reading-get-params)
  - [Removing a route](#removing-a-route)
  - [Navigating between routes](#navigating-between-routes)
  - [Augment your `<a>` tags](#augment-your-a-tags)
  - [Resolving routes](#resolving-routes)
  - [Hooks](#hooks)
    - [Type of hooks](#type-of-hooks)
    - [Defining hooks for specific route](#defining-hooks-for-specific-route)
    - [Defining hooks for all the routes](#defining-hooks-for-all-the-routes)
  - [Destroying the router](#destroying-the-router)
  - [Generating paths](#generating-paths)

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

`"/user/xxx/save"` matches the defined route. `"xxx"` maps to `id` and `"save"` to `action`. The data from the URL comes into the `data` field of the `Match` object passed to your handler.


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
  shouldResolve?: boolean;
};
```

The `navigate` method does two things. Changes the page URL (via the History APi of the browser) and triggers the resolving logic of the router. Consider the following example:

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

After the last line the browser will have in its address bar `/about` as a path and the in the console we'll see `"This is About page"`.

If you don't want to have a new entry in the history you should pass `{ historyAPIMethod: 'replaceState' }`. By default is `pushState`. The `shouldResolve` is a boolean flag that tells Navigo whether you want to handle the new route. By default is set to `true`.

## Augment your `<a>` tags

Let's say that we have a page with links (`<a>` tags). The links have `href` attributes pointing to locations inside your app. By default Navigo doesn't know about those links and if you click them you'll probably get a full page load. To augment those links and integrate them with Navigo just add `data-navigo` attribute. For example:

```html
<a href="/company/about" data-navigo>About</a>
```

When Navigo is initialized checks the page for such tags and attaches `click` handler which fires the router's `navigate` method.

Navigo has a method called `updatePageLinks` which you have to call every time when you change the DOM and you expect to see new links on the page. Because Navigo is not wired to a rendering engine doesn't really know about the DOM manipulations. It does though makes an assumption - after each of your route handlers there is a `updatePageLinks` call. The router expects that after the successful route resolving the DOM is updated and calls that function again. Feel free to fire `updatePageLinks` multiple times on the same DOM tree. There will be just one `click` handler attached to your links.

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

If there is a matching route you'll get an object of type `Match`. If not `resolve` returns `false`. When your route gets resolved its handler is called. It receives the the same `Match` object. From that object you can pull the data passed through the URL (if you used a parameterized path) or the GET params set in the URL.

If you need to see the latest match you can access it via the `lastResolved()` method.

## Hooks

The _hooks_ are functions that are fired as part of the resolving process. Think about them as lifecycle methods.

### Type of hooks

The hooks object has the following signature:

```typescript
type RouteHooks = {
  before?: (done: Function, match: Match) => void;
  after?: (match: Match) => void;
  leave?: (match: Match) => void;
  already?: (match: Match) => void;
};
```

* The `before` hook receives two arguments. The first one is a function that needs to be called with either no arguments or `false`. The no-argument version means "move forward". `false` stops the resolving and your handler will not be called.
* `after` is called after your handler
* `leave` is called when you are about to leave out of the route
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