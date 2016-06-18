# Navigo

A simple minimalistic JavaScript router with a fallback for older browsers.

---

[Demo and official page](http://work.krasimirtsonev.com/git/navigo/download)

## Installation

Via npm with `npm install navigo` or drop `lib/navigo.min.js` into your page.

## Usage

### Initialization

```js
var router = new Navigo(root = null, useHash=false);
```

The constructor of the library accepts two argument - `root` and `useHash`. The first one is the main URL of your application. If you call the constructor without parameters then Navigo figures out the root URL based on your routes.

If `useHash` set to `true` then the router uses an old routing approach with hash in the URL. Navigo anyways falls back to this mode if there is no History API supported.

### Adding a route

```js
router
  .on('/products/list', function () {
    // display all the products
  })
  .resolve();
```
or skip the first parameter and provide only a function and the router will fallback every non-existing URL to your handler. (suitable for displaying home page)

```js
router
  .on(function () {
    // show home page here
    // or handle page-not-found case
  })
  .resolve();
```
or use the following to pass multiple routes at once:

```js
router
  .on({
    '/products/list': function () { ... },
    '/products': function () { ... },
    ...
  })
  .resolve();
```

Navigo also supports a parameterized URLs:

```js
router
  .on('/user/:id/:action', function (params) {
    // If we have http://site.com/user/42/save as a url then
    // params.id = 42
    // params.action = save
  })
  .resolve();
```

We may also send a regular expression:

```js
router
  .on(/users\/(\d+)\/(\w+)\/?/, function (id, action) {
    // If we have http://site.com/user/42/save as a url then
    // id = 42
    // action = save
  })
  .resolve();
```

Wild card is also supported:

```js
router
  .on('/user/*', function () {
    // This function will be called on every
    // URL that starts with /user
  })
  .resolve();
```

The order of routes adding do matter. The URL which is added earlier and matches wins. For example:

```js
router
  .on({
    'products/:id': function () {
      setContent('Products');
    },
    'products': function () {
      setContent('About');
    },
    '*': function () {
      setContent('Home')
    }
  })
  .resolve();
```

It is important to add `products/:id` first because otherwise you may fall into `products` every time.

*Have in mind that every call of `on` do not trigger a route check (anymore). You have to run `resolve` method manually to get the routing works.*

### Changing the page

Use the `navigate` method:

```
router.navigate('/products/list');
```

You may also specify an absolute path. For example:

```
router.navigate('http://site.com/products/list', true);
```

If you want to bind page links to Navigo you have to add `data-navigo` attribute. For example:

```html
<a href="about" data-navigo>About</a>
```

It's translated to:

```js
// the html to: <a href="javascript:void(0);" data-navigo>About</a>
var location = link.getAttribute('href');
...
link.addEventListener('click', e => {
  e.preventDefault();
  router.navigate(location);
});
```

### Named routes

Use the following API to give a name to your route and later generate URLs:

```js
router = new Navigo('http://site.com/', true);
router.on({
  '/trip/:tripId/edit': { as: 'trip.edit', uses: handler },
  '/trip/save': { as: 'trip.save', uses: handler },
  '/trip/:action/:tripId': { as: 'trip.action', uses: handler }
});
console.log(router.generate('trip.edit', { tripId: 42 })); // --> /trip/42/edit
console.log(router.generate('trip.action', { tripId: 42, action: 'save' })); // --> /trip/save/42
console.log(router.generate('trip.save')); // --> /trip/save
```

### Resolving the routes

The resolving of the routes happen when `resolve` method is fired which happen:

* if you manually run `router.resolve()`
* every time when the page's URL changes
* if you call `navigate`

## API

* `router.on(function)` - adding a new route
* `router.on(string, function)` - adding a new route
* `router.on(object)` - adding a new route
* `router.navigate(path='', absolute=false)` - if `absolute` is `false` then Navigo finds the root path of your app based on the provided routes.
* `router.resolve(currentURL=undefined)` - if `currentURL` is provided then the method tries resolving the registered routes to that URL and not `window.location.href`.
* `router.destroy` - removes all the registered routes and stops the URL change listening.
* `router.link(path)` - it returns a full url of the given `path`

## Tests

```
npm i
npm test
```

## Inspiration

* [A modern JavaScript router in 100 lines](http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url)

## TODO

* A general handler for when Navigo matches some of the rules
