# Navigo

A simple dependency-free minimalistic JavaScript router

[![npm downloads](https://img.shields.io/npm/dm/navigo.svg?style=flat-square)](https://www.npmjs.com/package/navigo)

* [v.8+ documentation](./DOCUMENTATION.md)
* [v.7 documentation](./README_v7.md)
* [Examples](./examples)
* [Changelog](./CHANGELOG.md)

## Features

* Mapping route -> function call
* Parameterized routes
* Navigating between routes
* Hooks (_before_, _after_, _leave_, _already_)
* Not-found and default handlers
* Trigger Navigo routes with just `data-navigo` HTML attribute

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

## Development

```
> yarn install
> yarn dev
```

## Building

```
> yarn install
> yarn build
```

## Tests

```
> yarn install
> yarn test
> yarn test-watch
```

## MISC

* [A modern JavaScript router in 100 lines](http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url)
