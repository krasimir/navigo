# Navigo

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