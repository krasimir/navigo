# Navigo

A simple vanilla JavaScript router with a fallback for older browsers

## Installation

Via npm with `npm install navigo` or drop `lib/navigo.min.js` into your page.

## Usage

### Initialization

```js
var router = new Navigo([root = null]);
```

The constructor of the library accepts only one argument - `root`. That's the main URL of your application. If you call the constructor without parameters then Navigo figures out the root URL based on your routes.

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

## Tests

```
npm i
npm test
```

## Inspiration

* [A modern JavaScript router in 100 lines](http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url)
