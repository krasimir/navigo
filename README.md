# Navigo

> A simple minimalistic JavaScript router with a fallback for older browsers.

Checkout the [demo here](http://work.krasimirtsonev.com/git/navigo/download).

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
router.on('/products/list', function () {
  // display all the products
});
```
or skip the first parameter and provide only a function and the router will fallback every non-existing URL to your handler. (suitable for displaying home page)

```js
router.on(function () {
  // show home page here
  // or handle page-not-found case
});
```
or use the following to pass multiple routes at once:

```js
router.on({
  '/products/list': function () { ... },
  '/products': function () { ... },
  ...
});
```

Navigo also supports a parameterized URLs:

```js
router.on('/user/:id/:action', function (params) {
  // If we have http://site.com/user/42/save as a url then
  // params.id = 42
  // params.action = save
});
```

We may also send a regular expression:

```js
router.on(/users\/(\d+)\/(\w+)\/?/, function (id, action) {
  // If we have http://site.com/user/42/save as a url then
  // id = 42
  // action = save
});
```

Wild card is also supported:

```js
router.on('/user/*', function () {
  // This function will be called on every
  // URL that starts with /user
});
```

The order of routes adding do matter. The URL which is added earlier and matches wins. For example:

```js
router.on({
  'products/:id': function () {
    setContent('Products');
  },
  'products': function () {
    setContent('About');
  },
  '*': function () {
    setContent('Home')
  }
});
```

It is important to add `products/:id` first because otherwise you may fall into `products` every time.

*Have in mind that every call of `on` fires the `resolve` method of the router.*

### Changing the page

Use the `navigate` method:

```
router.navigate('/products/list');
```

You may also specify an absolute path. For example:

```
router.navigate('http://site.com/products/list', true);
```

### Resolving the routes

The library resolves the routes by itself. There is a public method `resolve` which is called:

* every time when the page's URL changes
* if you call `navigate`
* if you call `on` (register a new route)

## API

* `router.on(function)` - adding a new route
* `router.on(string, function)` - adding a new route
* `router.on(object)` - adding a new route
* `router.navigate(path='', absolute=false)` - if `absolute` is `false` then Navigo finds the root path of your app based on the provided routes.
* `router.resolve(currentURL=undefined)` - if `currentURL` is provided then the method tries resolving the registered routes to that URL and not `window.location.href`.
* `router.destroy` - removes all the registered routes and stops the URL change listening.

## Tests

```
npm i
npm test
```

## Inspiration

* [A modern JavaScript router in 100 lines](http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url)
