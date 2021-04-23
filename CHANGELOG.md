## 8.11.1

Fixing a bug with history items when using hash based routing.

## 8.11.0

Export to es5. A webpack config change.

## 8.10.1

Fixing a hash routing bug introduced in 8.10.0

## 8.10.0

* Issue #281 - make sure that the waiting tasks are executed even if a hook stops the routing logic.
* Introducing `linksSelector` option which allows you to use a custom CSS selector as a replacement of `data-navigo` attribute.

## 8.9.1

Fixing a bug with `navigateByName` #276

## 8.9.0

Adding `generateOptions` to the `generate` method. That's because the method always included the `root` of the router. And in the case of a SPA we usually don't want this.

## 8.8.12

Adding types. #274 by @egorshulga.

## 8.8.10 and 8.8.11

Fixing a bug with `matchLocation`.

## 8.8.9

Proper `url` of the Match object in case of custom `root`.

## 8.8.8

Fixing a bug with `directMatchWithLocation`. It wasn't aware for the `root`.

## 8.8.7

Making sure that the router is not "dirty" when the before and leave hook block the flow.

## 8.8.6

Fixing an issue with the change introduced in 8.8.5.

## 8.8.5

Fixing a case where a handler calls `navigate`. Introducing the concept of a `dirty` router state.

## 8.8.4

Support of regexp named groups. #270

## 8.8.3

Fixing a bug with notFound handler hooks. #271

## 8.8.2

Fixing typing.

## 8.8.1

Fixing a bug when a regexp is used as a path. #270

## 8.8.0

Adding a `hashString` to the `Match` object. #269

## 8.7.3

Fixing a bug with the hash based routing #268

## 8.7.2

Fixing a bug with `noMatchWarning` #267

## 8.7.1

Fixing an edge case with `navigateByName`.

## 8.7.0

Adding `navigateByName` method.

## 8.6.5

Custom handling of a leave hook in case of path is `*`.

## 8.6.4

Refactoring the leave hook implementation. The leave hook check now run a bit earlier and once per navigating. So far it was running for each of the matched routes. Also the hook now may accept an array of matches. Not only a single Match object.

## 8.6.2, 8.6.3

Fixing a bug with matching a wildcard.

## 8.6.1

Proper ES modules build.

## 8.6.0

Introducing `callHooks` flag to the `navigate` options.

## 8.5.0

* `data-navigo` now accepts a `"false"` (as string) argument.
* links with `target="_blank"` are ignored.

## 8.4.4

ES build. Fixing #261.

## 8.4.3

Better typing #264.

## 8.4.2

Fixing a problem with TypeScript compilation - [#261](https://github.com/krasimir/navigo/issues/261).

## 8.4.1

Fixing a bug with `updateBrowserURL` middleware.

## 8.4.0

`getRoute` now supports getting a route by its handler. Probably better than the name/path.

## 8.3.2

Fixing yet another bug with `getRoute`. Making it using the route's root.

## 8.3.1

Fixing a bug in the `getRoute` method.

## 8.3.0

Adding `addBeforeHook`, `addAfterHook`, `addAlreadyHook`, `addLeaveHook` and `getRoute` methods.

## 8.2.0

The router respects the combination between generic hooks and route specific hooks. It bundles them together. The order of execution is first the generic hook then the one defined for the route specifically.

## 8.1.1

No changes. Just refactoring.

## 8.1.0

Bringing back the hash based routing.

## 8.0.1

A really minor update in the pseudo not-found route used internally.

## 8.0.0

This is a complete re-write of the router. I decided to be a bad guy and kill/change some features. This is in favor of having cleaner code and I hope more stable implementation. The library was also doing bunch of assumptions for the root of your application which proved to be buggy and non-deterministic. So I'm removing this logic and asking you to set the root of your application.

### Deprecations

* ~Hash-based support for older browsers~ (it's back in 8.1.0 version)
* `pause` and `resume`. There is `shouldResolve` in the `navigate` method instead.
* `historyAPIUpdateMethod` method. It's now an option of the `navigate` method.
* `helpers` method
* `disableIfAPINotAvailable` method

### New features

* The `navigate` method now accepts options as a second argument which are there to cover more use cases.
* There is `data-navigo-options` HTML attributes for your links so you can pass options to the `navigate` method.

### Migration guide

* Change the initialization of the router to accept a single argument - the root of your application.
* Checkout your handlers if they read data from a parameterized URL or a GET param. If so make sure that they get the data from the single object passed to the function (an object of type `Match`)
  ```js
  type Match = {
    url: string;
    queryString: string;
    route: Route;
    data: Object | null; // data coming in the URL
    params: Object | null; // data coming in the query string
  };
  ```
  where `Route` is
  ```js
  type Route = {
    path: string;
    handler: Function;
    hooks: RouteHooks;
  };
  ```
* If you are using `historyAPIUpdateMethod` you'll need to pass a `historyAPIMethod` field to the options of navigate. For example:
  ```js
  router.navigate('/foo/bar', { historyAPIMethod: 'replaceState' })
  ```
* I hope you didn't use `router.helpers` but if you do explore the alternatives:
  ```js
  router.match -> router._matchRoute
  router.root -> router.root
  router.clean -> router._clean
  router.getOnlyURL -> router.extractGETParameters
  ```
* If you used the `pause` and `resume` methods you have to migrate your app to use `shouldResolve` param of the `navigate` method. Or in other words when navigating to define whether you want to have route handling or not. Example:
  ```js
  router.navigate('/foo/bar', { shouldResolve: false });
  ```
* `lastRouteResolved` becomes `lastResolved` and it returns an object of type `Match`. Checkout above. (or `null` if there is no resolved URL so far)

## 7.1.3

This version just adds a the following warning to the library:
```
console.warn("Navigo router library will have soon a major upgrade to version 8.0.0. If you don't have time for such migration please stick with the latest 7.1.2 version. To avoid seeing this message set a strict 7.1.2 in your package.json file.");
```

## 7.1.2

Open in new tab when Ctrl-key is pressed (#199)

## 7.0.0

Fixing the behavior of the hooks #182 #174

## 6.0.2

Make sure that the `leave` hook receives the URL params.

## 6.0.1

unpkg as CDN.

## 6.0.0

When using a `data-navigo` links we now read from the `href` attribute only. The router is not using `pathname` anymore. I again got the pros and cons of both approaches and I see that using `pathname` actually does not make a lot of sense now.

## 5.3.3

Resolving the route when we use hash based URL and have no dynamic route [#162](https://github.com/krasimir/navigo/issues/162)

## 5.3.2

Fixing the behavior of `getOnlyURL` function.

## 5.3.1

The `lastRouteResolved` now returns a `name` property for the [named routes](https://github.com/krasimir/navigo#named-routes).

## 5.3.0

Adding a new API method `historyAPIUpdateMethod`.

## 5.2.0

Sending matched route parameters to the general hooks. [#137](https://github.com/krasimir/navigo/issues/137)

## 5.1.0

Adding `already` hook. [#136](https://github.com/krasimir/navigo/issues/136)

## 5.0.2

Good call by [Daniel Bernhard](https://github.com/huevoncito) that my updates on the `clear` method actually breaks the links with `data-navigo`. This release fixes that.

## 5.0.1

It looks like calling History push or replace state doesn't trigger a popstate event. So we indeed have to call `resolve`. This version fixes that and `navigate` works again.

## 5.0.0

Issue [#128](https://github.com/krasimir/navigo/issues/128) made me rethink how Navigo handles routes. The route matching is based on regular expressions and one of them was not quite ok. That's now fixed as part of this latest release. However, these updates change how Navigo uses the registered routes so it may break your app.

## 4.8.0

* Adding generic hooks + leave hook [#107](https://github.com/krasimir/navigo/issues/107).

## 4.7.4

* Clear the `navigate` method. It is not calling `resolve` automatically. Related to [#115](https://github.com/krasimir/navigo/issues/115).

## 4.7.3

* Making sure that `generate` doesn't fail if there's a regex as a route [#125](https://github.com/krasimir/navigo/issues/125)

## 4.7.2

* Proper handling of the encoded URL parameter [#116](https://github.com/krasimir/navigo/issues/116)

## 4.7.1

* Fixing the bug described in [#122](https://github.com/krasimir/navigo/issues/122)

## 4.7.0

* Adding `getLinkPath` function to cover [#120](https://github.com/krasimir/navigo/issues/120)

## 4.6.2

* Fixing a bug in IE9 [#110](https://github.com/krasimir/navigo/pull/110)

## 4.6.1

* Using relative URLs in navigation [#109](https://github.com/krasimir/navigo/issues/109)

## 4.6.0

* Parameters from the parameterized routes are sent to hooks' handlers [#108](https://github.com/krasimir/navigo/pull/108)

## 4.5.2

* Fixing a bug under IE9 [#104](https://github.com/krasimir/navigo/pull/104)

## 4.5.1

* A bug fix for [#96](https://github.com/krasimir/navigo/pull/96) which was about a proper extracting of the GET parameters

## 4.5.0

* Adding `lastRouteResolved` public API ([#101](https://github.com/krasimir/navigo/pull/101))

## 4.4.0

* Providing an API for case insensitive route handling ([#100](https://github.com/krasimir/navigo/pull/100))

## 4.3.7

* [#97](https://github.com/krasimir/navigo/pull/97) - similar to #95 we are now using `addEventListener` when listening for browser API events.

## 4.3.6

* [#95](https://github.com/krasimir/navigo/pull/95) - keeping the already defined handler of `onhashchange`

## 4.3.4

* A path because of the latest release. It covers the case where we are using a custom hash. [#92](https://github.com/krasimir/navigo/issues/92)
>>>>>>> origin/master

## 4.3.2, 4.3.3

* Fixing [#87](https://github.com/krasimir/navigo/issues/87)

## 4.3.1

* Make sure we have a function when using named routes #86 (by Tobias Nyholm (@Nyholm))

## 4.3.0

* Support of custom hash string like `#!` for example. Read the [docs](https://github.com/krasimir/navigo/blob/master/README.md) for more information.

## 4.2.0

* Fixing [#82](https://github.com/krasimir/navigo/issues/82/).

## 4.1.1/2

* Adding `off` API method [#72](https://github.com/krasimir/navigo/issues/72).

## 4.0.1

* Fixing [#77](https://github.com/krasimir/navigo/issues/77/).

## 4.0.0

That's a minor but a breaking change. The `generate` method now outputs proper strings base on the `useHash` parameter. Or in other words if the router is using hash based routing the generated URLs contain `#` in the beginning.

## 3.5.1

* Proper initialization of the root when using `useHash = true`
* Minor fix while resolving hash based URLs (for Firefox)

## 3.5.0

* Adding a `resume` method which is same as `.pause(false)`. `.pause` now acts as `.pause(true)` by default.

## 3.4.2

* Fixing [#63](https://github.com/krasimir/navigo/issues/63/).

## 3.4.1

* Support of hooks in named routes. ([#60](https://github.com/krasimir/navigo/issues/60))

## 3.4.0

* Merging [#58](https://github.com/krasimir/navigo/pull/58) where we can prevent the handler calling from a before hook.

## 3.3.3

* Another try fixing [#57](https://github.com/krasimir/navigo/issues/57) - now if we have `noHash=false` the hash part of the URL is removed and we are no longer considering it while comparing the last resolved URL.

## 3.3.2

* Fixing [#57](https://github.com/krasimir/navigo/issues/57) - making sure that we keep the last resolved url when we have the `notFound` handler resolves.

## 3.3.1

* Fixing [#56](https://github.com/krasimir/navigo/issues/56) - When a `/` is given as a path it is considered as a default route handler.

## 3.3.0

* Start using [`onhaschange`](https://developer.mozilla.org/en/docs/Web/API/WindowEventHandlers/onhashchange) API as a default for hash based routing.
* Using [karma](https://www.npmjs.com/package/karma) as a test runner.

## 3.2.1

* Fixing the case where route handlers are not fired when only the query string part of the URL is changed (#53)

## 3.2.0

* [Accessing GET parameters](https://github.com/krasimir/navigo#accessing-get-parameters).

## 3.1.0

* [hooks](https://github.com/krasimir/navigo#hooks) support.
