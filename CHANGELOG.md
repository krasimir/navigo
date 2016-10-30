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
