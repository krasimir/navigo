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
