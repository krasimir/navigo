# Navigo

A simple dependency-free minimalistic JavaScript router

[![npm downloads](https://img.shields.io/npm/dm/navigo.svg?style=flat-square)](https://www.npmjs.com/package/navigo)
![size](https://badgen.net/bundlephobia/minzip/react)

* [v.8+ documentation](./DOCUMENTATION.md)
* [v.7 documentation](./README_v7.md)
* [Examples](./examples)
* [Changelog](./CHANGELOG.md)
* Using React? Checkout [navigo-react](https://github.com/krasimir/navigo-react) package.
* 🎮  Online playground here [codesandbox.io/s/navigo-example-jrui8](https://codesandbox.io/s/navigo-example-jrui8);

- [Navigo](#navigo)
  - [Selling points](#selling-points)
  - [Installation](#installation)
  - [Quick start](#quick-start)
  - [Development](#development)
  - [Building](#building)
  - [Tests](#tests)
  - [MISC](#misc)

## Selling points

* Dependency free
* ~10KB minified, ~4KB gzipped
* Based on [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) so it does update the URL of the page
* Supports hash based routing too
* Simple mapping of route to a function call
* Parameterized routes
* Navigating between routes
* Hooks (_before_, _after_, _leave_, _already_)
* Not-found and default handler
* Easy integration with HTML links via `data-navigo` HTML attribute

---

## Installation

Drop the following into your page:

```html
<script src="//unpkg.com/navigo"></script>
``` 

or via npm/yarn:

```bash
> npm install navigo --save
> yarn add navigo -S
```

## Quick start

```js
const router = new Navigo('/');
```

The constructor of the library accepts a single argument - the root path of your app. If you host your project at `https://site.com/my/awesome/app`, your root path is `/my/awesome/app`. Then you have to define your routes.

```js
router.on('/products/list', function () {
  // do something
});
```

At the end you have to trigger the resolving logic:

```js
router.resolve();
```

After that when you need a page change call the `navigate` method. This one changes the URL and (by default) triggers `resolve`.

```js
router.navigate('/about');
```

Add `data-navigo` attribute to your page links and they'll be transformed into `navigate` callers.

```html
<a href="/about/contacts" data-navigo>Contacts</a>
```

Checkout the [online playground](https://codesandbox.io/s/navigo-example-jrui8) to see it in action.

## Development

```
> yarn dev
```

## Building

```
> yarn build
```

## Tests

```
> yarn test
> yarn test-watch
```

## MISC

* [A modern JavaScript router in 100 lines](http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url)
