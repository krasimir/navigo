# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.18.0-next.1](https://github.com/ljharb/get-intrinsic/compare/v1.18.0-next.0...v1.18.0-next.1) - 2020-09-30

### Fixed

- [patch] `GetIntrinsic`: Adapt to override-mistake-fix pattern [`#79`](https://github.com/ljharb/object.assign/issues/79)
- [Fix] `ES2020`: `ToInteger`: `-0` should always be normalized to `+0` [`#116`](https://github.com/ljharb/get-intrinsic/issues/116)

### Commits

- [Tests] ses-compat - initialize module after ses lockdown [`311ff25`](https://github.com/ljharb/get-intrinsic/commit/311ff2536571c76d06e0ea5a48b835dbd8345537)
- [Tests] [Refactor] use defineProperty helper rather than assignment [`e957788`](https://github.com/ljharb/get-intrinsic/commit/e957788019cab11e64a7afd5582b22c8a14a5ca7)
- [Tests] [Refactor] clean up defineProperty test helper [`4e74e41`](https://github.com/ljharb/get-intrinsic/commit/4e74e4157594d835dfe122239a115f0b84a6b5b9)
- [Fix] `callBind`: ensure compatibility with SES [`e3d956a`](https://github.com/ljharb/get-intrinsic/commit/e3d956a221c4f4314928acc71da27533aa5e7c6b)
- [Deps] update `is-callable`, `object.assign` [`e094224`](https://github.com/ljharb/get-intrinsic/commit/e0942249ca82c4f9729e5049c5e40ca819804c6e)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`7677020`](https://github.com/ljharb/get-intrinsic/commit/7677020ec03e7608e860e318ac896431d18112bf)
- [Tests] temporarily allow SES tests to fail [`a2d744b`](https://github.com/ljharb/get-intrinsic/commit/a2d744b26cb9bb7730d21267fe702ee2a11f2008)
- [eslint] fix warning [`6547ecc`](https://github.com/ljharb/get-intrinsic/commit/6547eccb1cd566c6149cd038d7ea2bfd76a1f7de)

## [v1.18.0-next.0](https://github.com/ljharb/get-intrinsic/compare/v1.17.7...v1.18.0-next.0) - 2020-09-09

### Fixed

- [Fix] `ES5`+: `ToPropertyDescriptor`: use intrinsic TypeError [`#107`](https://github.com/ljharb/get-intrinsic/issues/107)
- [Fix] `ES2018+`: `CopyDataProperties`/`NumberToString`: use intrinsic TypeError [`#107`](https://github.com/ljharb/get-intrinsic/issues/107)

### Commits

- [New] add `ES2020` [`67a1a94`](https://github.com/ljharb/get-intrinsic/commit/67a1a94ee9c9b36d7505c0eac0e2b95a2811e5e4)
- [New] `ES5`+: add `abs`, `floor`; use `modulo` consistently [`d253fe0`](https://github.com/ljharb/get-intrinsic/commit/d253fe0f78ec0af9636083d6a7f9ebc55ec69412)
- [New] `ES2015`+: add `QuoteJSONString`, `OrdinaryCreateFromConstructor` [`4e8d479`](https://github.com/ljharb/get-intrinsic/commit/4e8d4797dd9353ff33bd6b748d8b0ed63d1fbbdb)
- [New] `GetIntrinsic`: Cache accessed intrinsics [`5999619`](https://github.com/ljharb/get-intrinsic/commit/599961920d3b977df94527601772e19cee1474fe)
- [New] `ES2018`+: add `SetFunctionLength`, `UnicodeEscape` [`343db0e`](https://github.com/ljharb/get-intrinsic/commit/343db0e0f761b99657d4da7f5c1a05cdcb5fcbeb)
- [New] `ES2017`+: add `StringGetOwnProperty` [`bcef4b2`](https://github.com/ljharb/get-intrinsic/commit/bcef4b2d03031cd4bbb9d417a03495d5b8c06ab6)
- [New] `ES2016`+: add `UTF16Encoding` [`a4340d8`](https://github.com/ljharb/get-intrinsic/commit/a4340d8d145d47928bb6ca1593f9c07d4e6c1204)
- [New] `GetIntrinsic`: Add ES201x function intrinsics [`1f8ad9b`](https://github.com/ljharb/get-intrinsic/commit/1f8ad9b85ef15ead22ccb6af78d335e5167c4026)
- [New] add `isLeadingSurrogate`/`isTrailingSurrogate` helpers [`7ae6aae`](https://github.com/ljharb/get-intrinsic/commit/7ae6aaeabe308e67a7e6eae94aa0bf51dd72e127)
- [Dev Deps] update `eslint` [`7e6ccd7`](https://github.com/ljharb/get-intrinsic/commit/7e6ccd7c78a35fcfdb593cbde7aefd30c94d80be)
- [New] `GetIntrinsic`: add `%AggregateError%`, `%FinalizationRegistry%`, and `%WeakRef%` [`249621e`](https://github.com/ljharb/get-intrinsic/commit/249621ed013ed62cb67fd8bfc99fed52b688d64f)
- [Dev Deps] update `eslint` [`f63d0a2`](https://github.com/ljharb/get-intrinsic/commit/f63d0a290c1aef446fa277f499dbb6a1942f8608)
- [Deps] update `is-regex` [`c2d4586`](https://github.com/ljharb/get-intrinsic/commit/c2d4586472c0385ad800ed8af9862b1f90defbaa)
- [Dev Deps] update `eslint` [`3f88447`](https://github.com/ljharb/get-intrinsic/commit/3f884471a5c373a3e69479edb32f64cb9a1e1f60)
- [Deps] update `object-inspect` [`bb82b41`](https://github.com/ljharb/get-intrinsic/commit/bb82b415015fa7810425dc2ed973cea9d27d7348)

## [v1.17.7](https://github.com/ljharb/get-intrinsic/compare/v1.17.6...v1.17.7) - 2020-09-30

### Fixed

- [patch] `GetIntrinsic`: Adapt to override-mistake-fix pattern [`#79`](https://github.com/ljharb/object.assign/issues/79)
- [Fix] `ES5`+: `ToPropertyDescriptor`: use intrinsic TypeError [`#107`](https://github.com/ljharb/get-intrinsic/issues/107)
- [Fix] `ES2018+`: `CopyDataProperties`/`NumberToString`: use intrinsic TypeError [`#107`](https://github.com/ljharb/get-intrinsic/issues/107)

### Commits

- [Fix] `callBind`: ensure compatibility with SES [`af46f9f`](https://github.com/ljharb/get-intrinsic/commit/af46f9fd55ec42f776b249150eac40a80f848b21)
- [Deps] update `is-callable`, `is-regex`, `object-inspect`, `object.assign` [`864f71d`](https://github.com/ljharb/get-intrinsic/commit/864f71dac9a812171eb1fc2975fcf5b166704f68)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`af450a8`](https://github.com/ljharb/get-intrinsic/commit/af450a8f3e82ccf266f85f58ab580f04bd47d300)

## [v1.17.6](https://github.com/ljharb/get-intrinsic/compare/v1.17.5...v1.17.6) - 2020-06-13

### Commits

- [meta] mark spackled files as autogenerated [`286a24b`](https://github.com/ljharb/get-intrinsic/commit/286a24b26aefd6463ebe0a41e43fdd67257851c0)
- [Tests] reformat expected missing ops [`8a9cf6a`](https://github.com/ljharb/get-intrinsic/commit/8a9cf6ab4016ac388549b54961f48ad1417cdac4)
- [meta] `ES2015`: complete ops list [`c98e703`](https://github.com/ljharb/get-intrinsic/commit/c98e7031b6618b93c633d537bb5541df20b13734)
- [Fix] `ES2015+`: `IsConstructor`: when `Reflect.construct` is available, be spec-accurate [`d959e6d`](https://github.com/ljharb/get-intrinsic/commit/d959e6d039b4a186f4e3f13f7968d9a44bce9022)
- [Fix] `ES2015+`: `Set`: Always return boolean value [`24c2ac0`](https://github.com/ljharb/get-intrinsic/commit/24c2ac073c13685f67ff68a21d06a57ced6eabe9)
- [Fix]: Use `Reflect.apply(…)` if available [`606a752`](https://github.com/ljharb/get-intrinsic/commit/606a752c1d32ff37df59e21f2ed8e465ec20319c)
- [Fix] `2016`: Use `getIteratorMethod` in `IterableToArrayLike` [`9464824`](https://github.com/ljharb/get-intrinsic/commit/94648247357afe6f0c5feb8766c3eb05948f46b7)
- [Tests] try out CodeQL analysis [`f0c185b`](https://github.com/ljharb/get-intrinsic/commit/f0c185b9145553d16b67eaae1b7af99f98d57981)
- [Fix] `ES2015+`: `Set`: ensure exceptions are thrown in IE 9 when requested [`7a963e3`](https://github.com/ljharb/get-intrinsic/commit/7a963e3939da431e994d2181875f95b1e8ab239e)
- [Test]: Run tests with `undefined` this [`5322bde`](https://github.com/ljharb/get-intrinsic/commit/5322bdef67de6d179d09900422fe95a14485ba30)
- [Fix] `helpers/getSymbolDescription`: use the global Symbol registry when available [`9e1c00d`](https://github.com/ljharb/get-intrinsic/commit/9e1c00dd2eb4f2202661bba69274f9cd9e4b660a)
- [Fix] `2018+`: Fix `CopyDataProperties` depending on `this` [`8a05dc9`](https://github.com/ljharb/get-intrinsic/commit/8a05dc9aeba1d1f603d986dc6ac43f81f16d8c52)
- [Tests] `helpers/getSymbolDescription`: add test cases [`e468cbe`](https://github.com/ljharb/get-intrinsic/commit/e468cbed7ceb07454d8fd8d86bdfd5c46f18b66f)
- [Tests] some envs have `Symbol.for` but can not infer a name [`2ab5e6d`](https://github.com/ljharb/get-intrinsic/commit/2ab5e6d15404999ac4fee8050c653d863c0e04c4)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `in-publish`, `object-is`, `tape`; add `aud` [`752669e`](https://github.com/ljharb/get-intrinsic/commit/752669e7a87aa289c98f35a33d0554fdcaaa54b9)
- [meta] `Type`: fix spec URL [`965b68b`](https://github.com/ljharb/get-intrinsic/commit/965b68bce27d500ca520ec91e15d9cf4633ff9f7)
- [Deps] switch from `string.prototype.trimleft`/`string.prototype.trimright` to `string.prototype.trimstart`/`string.prototype.trimend` [`80dc848`](https://github.com/ljharb/get-intrinsic/commit/80dc8485f1db88d927cc006d0ad9da1daa26e777)
- [Deps] update `is‑callable`, `is‑regex` [`e280a27`](https://github.com/ljharb/get-intrinsic/commit/e280a2785f86f33ed730cfa74f2b8a2de86793fe)
- [Dev Deps] update `eslint`, `tape` [`5a1188f`](https://github.com/ljharb/get-intrinsic/commit/5a1188fe6bee6e4a57fb9ab4146f4ebc52fc4bbe)
- [Fix] `helpers/floor`: module-cache `Math.floor` [`fddd8e6`](https://github.com/ljharb/get-intrinsic/commit/fddd8e6457876e3df1fd41b396a10f14d59a19f4)
- [Fix] `helpers/OwnPropertyKeys`: Use `Reflect.ownKeys(…)` if available [`65068e7`](https://github.com/ljharb/get-intrinsic/commit/65068e7f81fda0956f56b6cb8fba115596fccd37)
- [Fix] `helpers/getSymbolDescription`: Prefer bound `description` getter when present [`537d8d5`](https://github.com/ljharb/get-intrinsic/commit/537d8d5a1cc3c2a046edf693a984685b09998e44)
- [Dev Deps] update `eslint` [`c2440d9`](https://github.com/ljharb/get-intrinsic/commit/c2440d9a4779671dc97009a9a8f10dd569d5e5ea)
- [eslint] `helpers/isPropertyDescriptor`: fix indentation [`e438539`](https://github.com/ljharb/get-intrinsic/commit/e43853995f2a13e3b715ce6cd7b263ab6b422d36)

## [v1.17.5](https://github.com/ljharb/get-intrinsic/compare/v1.17.4...v1.17.5) - 2020-03-22

### Commits

- [Fix] `CreateDataProperty`: update an existing property [`bdd77b5`](https://github.com/ljharb/get-intrinsic/commit/bdd77b507eb23bce9d6b3c1961435afd41660f43)
- [Dev Deps] update `@ljharb/eslint-config` [`9f1690f`](https://github.com/ljharb/get-intrinsic/commit/9f1690f0e4d4a88e044ccd128de7c838951ac7af)
- [Dev Deps] update `make-arrow-function`, `tape` [`920a682`](https://github.com/ljharb/get-intrinsic/commit/920a6827c7d2c7d2b1260f008270734eb3a6fe6c)
- [Fix] run missing spackle from cd7504701879ddea0f5981e99cbcf93bfea9171d [`b9069ac`](https://github.com/ljharb/get-intrinsic/commit/b9069ac46060732a0b8bbc36479851ee272cf463)

## [v1.17.4](https://github.com/ljharb/get-intrinsic/compare/v1.17.3...v1.17.4) - 2020-01-21

### Commits

- [Fix] `2015+`: add code to handle IE 8’s problems: [`cd75047`](https://github.com/ljharb/get-intrinsic/commit/cd7504701879ddea0f5981e99cbcf93bfea9171d)
- [Tests] fix tests for IE 8 [`c625ee1`](https://github.com/ljharb/get-intrinsic/commit/c625ee169c52e1a0f573ba3015c9bc8497acd366)

## [v1.17.3](https://github.com/ljharb/get-intrinsic/compare/v1.17.2...v1.17.3) - 2020-01-19

### Commits

- [Fix] `ObjectCreate` `2015+`: Fall back to `__proto__` and normal `new` in older browsers [`71772e2`](https://github.com/ljharb/get-intrinsic/commit/71772e252bbe7bbdc2ba6bc819896ba9eeb213a0)
- [Fix] `GetIntrinsic`: ensure the `allowMissing` property actually works on dotted intrinsics [`05a2883`](https://github.com/ljharb/get-intrinsic/commit/05a288305f01e6fb51e4e4126fd85c1f496c6691)

## [v1.17.2](https://github.com/ljharb/get-intrinsic/compare/v1.17.1...v1.17.2) - 2020-01-14

### Commits

- [Fix] `helpers/OwnPropertyKeys`: include non-enumerables too [`810b305`](https://github.com/ljharb/get-intrinsic/commit/810b30522b85fb6203194894c5068528c041b602)

## [v1.17.1](https://github.com/ljharb/get-intrinsic/compare/v1.17.0...v1.17.1) - 2020-01-14

### Commits

- [Refactor] add `OwnPropertyKeys` helper, use it in `CopyDataProperties` [`406775c`](https://github.com/ljharb/get-intrinsic/commit/406775c5e155c560e017207b743025577eb89756)
- [Refactor] `IteratorClose`: remove useless assignment [`e0e74ce`](https://github.com/ljharb/get-intrinsic/commit/e0e74ce25e4b182f05033f0ca5241c932baf4ba8)
- [Dev Deps] update `eslint`, `tape` [`7fcb8ad`](https://github.com/ljharb/get-intrinsic/commit/7fcb8adfa71ee7ae79352b0e09d4b26b2278fd1b)
- [Dev Deps] update `diff` [`8645d63`](https://github.com/ljharb/get-intrinsic/commit/8645d635e5ce060900d4d365e05c878d97b0973e)

## [v1.17.0](https://github.com/ljharb/get-intrinsic/compare/v1.17.0-next.1...v1.17.0) - 2019-12-20

### Commits

- [Refactor] `GetIntrinsic`: remove the internal property salts, since % already handles that [`3567ae9`](https://github.com/ljharb/get-intrinsic/commit/3567ae92c6e6041bbbca9fb688b6eb7cd55d824e)
- [meta] remove unused Makefile and associated utils [`f0b1083`](https://github.com/ljharb/get-intrinsic/commit/f0b1083130078c988e5704ea6bfaeb7a560a0ff0)
- [Refactor] `GetIntrinsic`: further simplification [`9be0385`](https://github.com/ljharb/get-intrinsic/commit/9be038535161ae13a1cb33c2c3f9eda989e65779)
- [Fix] `GetIntrinsic`: IE 8 has a broken `Object.getOwnPropertyDescriptor` [`c52fa59`](https://github.com/ljharb/get-intrinsic/commit/c52fa59eb8cccc9f2911f17f0e1d9877290ed6c7)
- [Deps] update `is-callable`, `string.prototype.trimleft`, `string.prototype.trimright` [`fb308ec`](https://github.com/ljharb/get-intrinsic/commit/fb308ec1bac3a0abb771df2dbf8019077e3a8edd)
- [Dev Deps] update `@ljharb/eslint-config` [`96719b9`](https://github.com/ljharb/get-intrinsic/commit/96719b933e487088cf4a94be05805a7ed779001d)
- [Dev Deps] update `tape` [`b84552d`](https://github.com/ljharb/get-intrinsic/commit/b84552d1985eadf604fa91c839254c7ed530fb9b)
- [Dev Deps] update `object-is` [`e2df4de`](https://github.com/ljharb/get-intrinsic/commit/e2df4de34c18f3cd544c0b5a8d06ee05f7b7c36a)
- [Deps] update `is-regex` [`158ed34`](https://github.com/ljharb/get-intrinsic/commit/158ed3491fe3fb19f54d43a2ece2baf37201aefa)
- [Dev Deps] update `object.fromentries` [`84c50fb`](https://github.com/ljharb/get-intrinsic/commit/84c50fb95c736579f5113911d82da45032f04e43)
- [Tests] add `.eslintignore` [`0c7f99a`](https://github.com/ljharb/get-intrinsic/commit/0c7f99a0a3d36298654a6808f878c991c13e6f2d)

## [v1.17.0-next.1](https://github.com/ljharb/get-intrinsic/compare/v1.17.0-next.0...v1.17.0-next.1) - 2019-12-11

### Commits

- [Meta] only run spackle script in publish [`4bc91b8`](https://github.com/ljharb/get-intrinsic/commit/4bc91b8b2564afa8a88783a88e2bab143f59bd10)
- [Fix] `object.assign` is a runtime dep [`71b8d22`](https://github.com/ljharb/get-intrinsic/commit/71b8d22b2e753181bc8697798be65fc728aa50fa)

## [v1.17.0-next.0](https://github.com/ljharb/get-intrinsic/compare/v1.16.3...v1.17.0-next.0) - 2019-12-11

### Merged

- [New] Split up each operation into its own file [`#77`](https://github.com/ljharb/get-intrinsic/pull/77)

### Commits

- [meta] spackle! [`0deb443`](https://github.com/ljharb/get-intrinsic/commit/0deb443a31412962f52174c7f1b333e688669066)
- [New] split up each operation into its own file [`990c8be`](https://github.com/ljharb/get-intrinsic/commit/990c8be643203ac20bc6c6fc5f027dacc62834a9)
- [meta] add `spackle` script to fill in holes of operations that inherit from previous years [`e5ee0ba`](https://github.com/ljharb/get-intrinsic/commit/e5ee0baf59e41d2bd00ae980f867bf52ec251e38)

## [v1.16.3](https://github.com/ljharb/get-intrinsic/compare/v1.16.2...v1.16.3) - 2019-12-04

### Commits

- [Fix] `GetIntrinsic`: when given a path to a getter, return the actual getter [`0c000ee`](https://github.com/ljharb/get-intrinsic/commit/0c000ee62bedac8c2be38613492f5492088043df)
- [Dev Deps] update `eslint` [`f2d1a86`](https://github.com/ljharb/get-intrinsic/commit/f2d1a8654b8be01576f6add586d1cd363885bb79)

## [v1.16.2](https://github.com/ljharb/get-intrinsic/compare/v1.16.1...v1.16.2) - 2019-11-24

### Commits

- [Fix] IE 6-8 strings can’t use array slice, they need string slice [`fa5f0cc`](https://github.com/ljharb/get-intrinsic/commit/fa5f0cc5c9d734c0355bd51f26da76d255f74232)
- [Fix] IE 6-7 lack JSON [`e529b4b`](https://github.com/ljharb/get-intrinsic/commit/e529b4bf20be76bff3ff392699692af4b9297884)
- [Dev Deps] update `eslint` [`bf52fa4`](https://github.com/ljharb/get-intrinsic/commit/bf52fa48f7d40dae2f53d6d09d00f107d1305d20)

## [v1.16.1](https://github.com/ljharb/get-intrinsic/compare/v1.16.0...v1.16.1) - 2019-11-24

### Fixed

- [meta] re-include year files inside `operations` [`#62`](https://github.com/ljharb/get-intrinsic/issues/62)

### Commits

- [Tests] use shared travis-ci config [`17fb792`](https://github.com/ljharb/get-intrinsic/commit/17fb792b654a4fc866f9a59379f5b621462159e9)
- [Dev Deps] update `eslint` [`11096ee`](https://github.com/ljharb/get-intrinsic/commit/11096ee9f0179f0eda79d71974190761ddd28e8d)
- [Fix] `GetIntrinsics`: turns out IE 8 throws when `Object.getOwnPropertyDescriptor(arguments);`, and does not throw on `callee` anyways [`14e0115`](https://github.com/ljharb/get-intrinsic/commit/14e0115afd53b9d81fc2739c67cee02b7d682121)
- [Tests] add Automatic Rebase github action [`37ae5a5`](https://github.com/ljharb/get-intrinsic/commit/37ae5a52a4e3ef6137fe04eb678842bd3d273a19)
- [Dev Deps] update `@ljharb/eslint-config` [`dc500f2`](https://github.com/ljharb/get-intrinsic/commit/dc500f2623604a87b8e5cb490e8a369e2d7f720c)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `safe-publish-latest` [`51805a6`](https://github.com/ljharb/get-intrinsic/commit/51805a68a83fb21824961c7a35f77921681f39f3)
- [Deps] update `es-to-primitive`, `has-symbols`, `object-inspect` [`114c0a8`](https://github.com/ljharb/get-intrinsic/commit/114c0a86a7814f6f9962ffb73d09610bde4409a0)
- [meta] add `funding` field [`466f48f`](https://github.com/ljharb/get-intrinsic/commit/466f48fafd9227eb585989e59de359bea864eb0a)
- [Tests] disable `check-coverage`, and let codecov do it [`941d75b`](https://github.com/ljharb/get-intrinsic/commit/941d75b08c3b5d061866913d7047f1bed3b97791)
- [actions] fix rebase action to use master [`d3a597a`](https://github.com/ljharb/get-intrinsic/commit/d3a597a9fc9927e7e76da1818fcdc334476cc512)
- [meta] name the rebase action [`bbc9331`](https://github.com/ljharb/get-intrinsic/commit/bbc93318d834cd5e53494a6248c101a0f08359dd)

## [v1.16.0](https://github.com/ljharb/get-intrinsic/compare/v1.15.0...v1.16.0) - 2019-10-18

### Commits

- [Fix] `GetIterator`: add fallback for pre-Symbol environments, tests [`1891885`](https://github.com/ljharb/get-intrinsic/commit/1891885f8ccead8e212f574cf7c1ef68715e3c72)
- [New] `ES2015+`: add `SetFunctionName` [`d171aea`](https://github.com/ljharb/get-intrinsic/commit/d171aea0d90048e787e7cff9f4aaf3fe5248a1d5)
- [New] add `getSymbolDescription` and `getInferredName` helpers [`f721f34`](https://github.com/ljharb/get-intrinsic/commit/f721f34e19025767851822c9328ca17270b05578)
- [New] `ES2016+`: add `OrdinarySetPrototypeOf` [`0fd1234`](https://github.com/ljharb/get-intrinsic/commit/0fd12343f3e02386c385413fa9c2ff4bd7780e0b)
- [New] `ES2015+`: add `CreateListFromArrayLike` [`b11432a`](https://github.com/ljharb/get-intrinsic/commit/b11432aec3852850ae39afafd43c5e36950dcc22)
- [New] `ES2015+`: add `GetPrototypeFromConstructor`, with caveats [`f1d05e0`](https://github.com/ljharb/get-intrinsic/commit/f1d05e0f91f7053a925f8f3c634671c65fab37a2)
- [New] `ES2016+`: add `OrdinaryGetPrototypeOf` [`1e43409`](https://github.com/ljharb/get-intrinsic/commit/1e4340974db457ded9b5c375aa326b13e038e145)
- [Tests] add `node` `v12.2` [`8fc2556`](https://github.com/ljharb/get-intrinsic/commit/8fc25561cbfed1cba3d1db94e573ed6b799578f1)
- [Tests] drop statement threshold [`ef4b0df`](https://github.com/ljharb/get-intrinsic/commit/ef4b0dfff3f79f52767973efaae181a74ca5f4be)
- [Dev Deps] update `object.fromentries` [`26830be`](https://github.com/ljharb/get-intrinsic/commit/26830bebe02a2a06d8965ee7b206575bfd4709dc)

## [v1.15.0](https://github.com/ljharb/get-intrinsic/compare/v1.14.2...v1.15.0) - 2019-10-02

### Commits

- [New] `ES5`+: add `msFromTime`, `SecFromTime`, `MinFromTime`, `HourFromTime`, `TimeWithinDay`, `Day`, `DayFromYear`, `TimeFromYear`, `YearFromTime`, `WeekDay`, `DaysInYear`, `InLeapYear`, `DayWithinYear`, `MonthFromTime`, `DateFromTime`, `MakeDay`, `MakeDate`, `MakeTime`, `TimeClip`, `modulo` [`2722e96`](https://github.com/ljharb/get-intrinsic/commit/2722e968af42af259fb4c4cec408ce1b33e6de66)
- [New] add ES2020’s intrinsic dot notation [`0be1213`](https://github.com/ljharb/get-intrinsic/commit/0be1213284bede338f60bf96a9621d6eab4883eb)
- [New] add `callBound` helper [`4ea63aa`](https://github.com/ljharb/get-intrinsic/commit/4ea63aab6d6b9f8b2e50aca47c5d4b4b9dacd4ef)
- [New] `ES2018`+: add `DateString`, `TimeString` [`9fdeaf5`](https://github.com/ljharb/get-intrinsic/commit/9fdeaf558bafd42d1521ce9de8db198d887cf3fc)
- [meta] npmignore operations scripts; add "deltas" [`a71d377`](https://github.com/ljharb/get-intrinsic/commit/a71d377045d5026875bae4f9cc06f770b59c5181)
- [New] add `isPrefixOf` helper [`8230a5e`](https://github.com/ljharb/get-intrinsic/commit/8230a5e0f268bc9548c616c96e63614f07c997b0)
- [New] `ES2015`+: add `ToDateString` [`b215d86`](https://github.com/ljharb/get-intrinsic/commit/b215d8600ebbc1b26e86ff821545dda8e03fab46)
- [New] add `regexTester` helper [`bf462c6`](https://github.com/ljharb/get-intrinsic/commit/bf462c63ce0dcc902c267379cc3480a913c0dc67)
- [New] add `maxSafeInteger` helper [`c15a612`](https://github.com/ljharb/get-intrinsic/commit/c15a612b86d56d1794d6ef84b93d9e7721b1096b)
- [Tests] on `node` `v12.11` [`9538b51`](https://github.com/ljharb/get-intrinsic/commit/9538b51cc1ccaf1c517df48e29fd8fa8f50b238d)
- [Deps] update `string.prototype.trimleft`, `string.prototype.trimright` [`ba00f56`](https://github.com/ljharb/get-intrinsic/commit/ba00f56d4eb0ed6d7bcbc2b483cf273c686d249b)
- [Dev Deps] update `eslint` [`d7ea1b8`](https://github.com/ljharb/get-intrinsic/commit/d7ea1b8fc75e1a552692552778e388d300d275ff)

## [v1.14.2](https://github.com/ljharb/get-intrinsic/compare/v1.14.1...v1.14.2) - 2019-09-08

### Commits

- [Fix] `ES2016`: `IterableToArrayLike`: add proper fallback for strings, pre-Symbols [`a6b5b30`](https://github.com/ljharb/get-intrinsic/commit/a6b5b30f322be791c9b979a98875212491a8581a)
- [Tests] on `node` `v12.10` [`ce0f82b`](https://github.com/ljharb/get-intrinsic/commit/ce0f82b2b81588f2f5e9bd2efc812b7625667315)

## [v1.14.1](https://github.com/ljharb/get-intrinsic/compare/v1.14.0...v1.14.1) - 2019-09-03

## [v1.14.0](https://github.com/ljharb/get-intrinsic/compare/v1.13.0...v1.14.0) - 2019-09-02

### Commits

- [New] add ES2019 [`3bacba8`](https://github.com/ljharb/get-intrinsic/commit/3bacba857f9096cba328dbddd2879546495afc72)
- [New] `ES2015+`: add `ValidateAndApplyPropertyDescriptor` [`338bc63`](https://github.com/ljharb/get-intrinsic/commit/338bc63bfadd683970931ab1cef8e36024487391)
- [New] `ES2015+`: add `GetSubstitution` [`f350165`](https://github.com/ljharb/get-intrinsic/commit/f35016589a223f7e74182c5ab33e3398420a0f9a)
- [New] ES5+: add `Abstract Equality Comparison`, `Strict Equality Comparison` [`bb0aaaf`](https://github.com/ljharb/get-intrinsic/commit/bb0aaafd0c30b9b1dabc6e6d299cba75a79de077)
- [Tests] fix linting to apply to all files [`dda7421`](https://github.com/ljharb/get-intrinsic/commit/dda742178ebce166e4f1ada7684ac045032fcd42)
- [New] ES5+: add `Abstract Relational Comparison` [`96eb298`](https://github.com/ljharb/get-intrinsic/commit/96eb298be0c8c41d8ed922bda2b3762ce3cb708d)
- [Tests] add some missing ES2015 ops [`1efe5de`](https://github.com/ljharb/get-intrinsic/commit/1efe5de0f98e6912c25baa006eaa0cce7a9eb543)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`138143e`](https://github.com/ljharb/get-intrinsic/commit/138143e0f724720ac7316bacb161b4d32c0a0fdc)
- [New] `ES2015+`: add `OrdinaryGetOwnProperty` [`0609672`](https://github.com/ljharb/get-intrinsic/commit/0609672ca9b48ea387013a4c3ea4a975d8e774cd)
- [New] add `callBind` helper, and use it [`9518775`](https://github.com/ljharb/get-intrinsic/commit/9518775eba69c2645daaabae44e8249b3d73f0a6)
- [New] `ES2015+`: add `ArraySetLength` [`799302e`](https://github.com/ljharb/get-intrinsic/commit/799302e3cf662c614fe3b434d6581fa17f5f5eba)
- [Tests] use the values helper more in es5 tests [`1a6337f`](https://github.com/ljharb/get-intrinsic/commit/1a6337f7689a8657d65d1acf365532c973edeab2)
- [Tests] migrate es5 tests to use values helper [`95cadbb`](https://github.com/ljharb/get-intrinsic/commit/95cadbbdddbf66af637ffec9d138473eeb237352)
- [New] `ES2016`: add `IterableToArrayLike` [`06b9be9`](https://github.com/ljharb/get-intrinsic/commit/06b9be96b132ef9b8b085c772d0215866917b73a)
- [New] ES2015+: add `TestIntegrityLevel` [`e0cd84d`](https://github.com/ljharb/get-intrinsic/commit/e0cd84dc8f5e3e5605962851575e6a897e9b4a93)
- [New] ES2015+: add `SetIntegrityLevel` [`658bd05`](https://github.com/ljharb/get-intrinsic/commit/658bd05a385fd4552a41f7726518e035959c0481)
- [New] `ES2015+`: add `GetOwnPropertyKeys` [`6e57098`](https://github.com/ljharb/get-intrinsic/commit/6e570987a3c70b03574293b98479d733821a3092)
- [Fix] `ES2015+`: `FromPropertyDescriptor`: no longer requires a fully complete Property Descriptor [`bac1b26`](https://github.com/ljharb/get-intrinsic/commit/bac1b26bd303d9ec0de0bde7ef200bbfaf99492a)
- [New] `ES2015+`: add `ArrayCreate` [`ccb47e4`](https://github.com/ljharb/get-intrinsic/commit/ccb47e4938b1aca4e766e2915969a8256f3bd51f)
- [Fix] `ES2015+`: `CreateDataProperty`, `DefinePropertyOrThrow`, `ValidateAndApplyPropertyDescriptor`: add fallbacks for ES3 [`c538dd8`](https://github.com/ljharb/get-intrinsic/commit/c538dd87442bde76cdd1a50be8a30ae52cf9cd9a)
- [meta] change http URLs to https [`d8b1e87`](https://github.com/ljharb/get-intrinsic/commit/d8b1e874e5606fe15904e11ee1bae047df40d97f)
- [New] `ES2015+`: add `InstanceofOperator` [`6a431b9`](https://github.com/ljharb/get-intrinsic/commit/6a431b90b9807d644a509374a272ec8ab5abf8b0)
- [New] `ES2015+`: add `OrdinaryDefineOwnProperty` [`f5ae698`](https://github.com/ljharb/get-intrinsic/commit/f5ae698f3d1148233b91e60995ac78666cf0912d)
- [New] `ES2017+`: add `IterableToList` [`2a99268`](https://github.com/ljharb/get-intrinsic/commit/2a992680b552fb54532da6a976c1921baab83a0b)
- [New] `ES2015+`: add `CreateHTML` [`06750b2`](https://github.com/ljharb/get-intrinsic/commit/06750b2bc1141129b9c9fdb929bc5c989e1266cc)
- [Tests] add v.descriptors helpers [`f229347`](https://github.com/ljharb/get-intrinsic/commit/f2293479002f02ca946c7ca33f1defcc1a149fcc)
- [New] add `isPropertyDescriptor` helper [`c801cef`](https://github.com/ljharb/get-intrinsic/commit/c801cef62c7c60a80771199115ed2d84615e11cf)
- [New] ES2015+: add `OrdinaryHasInstance` [`ea69a84`](https://github.com/ljharb/get-intrinsic/commit/ea69a84ca8c4a6a2702a708caf01d8c262a350ab)
- [New] `ES2015+`: add `OrdinaryHasProperty` [`979fd9e`](https://github.com/ljharb/get-intrinsic/commit/979fd9eda18442c9b8adbf9c434331a8fde0eb4a)
- [New] `ES2015+`: add `SymbolDescriptiveString` [`2bcde98`](https://github.com/ljharb/get-intrinsic/commit/2bcde98310b680146c76b58aaae799c73a4198b6)
- [New] ES2015+: add `IsPromise` [`cbdd387`](https://github.com/ljharb/get-intrinsic/commit/cbdd3872f81ed490c104cdbfb8dd16aa4dc3d285)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `safe-publish-latest`, `semver`, `replace` [`ce4d3c4`](https://github.com/ljharb/get-intrinsic/commit/ce4d3c42c5fb2408156c3dc768162f3561e95413)
- [Tests] some intrinsic cleanup [`6f0f437`](https://github.com/ljharb/get-intrinsic/commit/6f0f437394f1e234c542150e06df8dae8af5b4b9)
- [Tests] up to `node` `v12.4`, `v11.15`, `v6.17` [`48e2dbb`](https://github.com/ljharb/get-intrinsic/commit/48e2dbbe12f6b5b4cb9b93fbfd822ef1b0087301)
- [Fix] `ES2015+`: `ValidateAndApplyPropertyDescriptor`: use ES2017 logic to bypass spec bugs [`3ca93d3`](https://github.com/ljharb/get-intrinsic/commit/3ca93d313cd9d0744295ce961d3e177b183d4411)
- [Tests] up to `node` `v12.6`, `v10.16`, `v8.16` [`fe18201`](https://github.com/ljharb/get-intrinsic/commit/fe182015152bb2fe83662659f9111c886d81624c)
- add FUNDING.yml [`16ffa72`](https://github.com/ljharb/get-intrinsic/commit/16ffa725ebe0a64611550e10ccd7b4155806b718)
- [Fix] `ES5`: `IsPropertyDescriptor`: call into `IsDataDescriptor` and `IsAccessorDescriptor` [`0af0e31`](https://github.com/ljharb/get-intrinsic/commit/0af0e31329b123a29307cb6e52059ebc82ab87a7)
- [New] add `every` helper [`1fd013c`](https://github.com/ljharb/get-intrinsic/commit/1fd013c1a94f16a2323c603277c60b446371228c)
- [Tests] use `npx aud` instead of `npm audit` with hoops [`6a5a357`](https://github.com/ljharb/get-intrinsic/commit/6a5a357eae7461c02f666eb45d77b8193d31d11d)
- [Tests] up to `node` `v12.9` [`7eb3080`](https://github.com/ljharb/get-intrinsic/commit/7eb3080e2568eb9c30d68977d7691bb60bf00e63)
- [Dev Deps] update `cheerio`, `eslint`, `semver`, `tape` [`8028280`](https://github.com/ljharb/get-intrinsic/commit/802828064b8340c2777fd288ed9b2d54757473ef)
- [Fix] `ES2015+`: `GetIterator`: only require native Symbols when `method` is omitted [`35c96a5`](https://github.com/ljharb/get-intrinsic/commit/35c96a52a4af5da6a1d1caabd302eb8dd44f47ae)
- readme: add security note [`2f59799`](https://github.com/ljharb/get-intrinsic/commit/2f59799f988985e8f88f359ebc7b3f5db1a9d8c3)
- [Dev Deps] update `eslint`, `replace`, `tape` [`10875c9`](https://github.com/ljharb/get-intrinsic/commit/10875c9360ac7546aa8c20cc2319eff4f847b9f9)
- [Fix] `ES2015`: `Call`: error message now properly displays Symbols using `object-inspect` [`14b298a`](https://github.com/ljharb/get-intrinsic/commit/14b298a82ac3603e2c098e17107c07b4bdddc299)
- [Refactor] use `has-symbols` for Symbol detection [`35c6730`](https://github.com/ljharb/get-intrinsic/commit/35c673011f132cd02f450bd701e22b4846f3e68a)
- [Tests] use `eclint` instead of `editorconfig-tools` [`bffa735`](https://github.com/ljharb/get-intrinsic/commit/bffa7355ea17e191bd5097d52177848c082a87da)
- [Tests] run `npx aud` only on prod deps [`ba56593`](https://github.com/ljharb/get-intrinsic/commit/ba56593083cbc75fc9428a4b468cfbd264751379)
- [Dev Deps] update `eslint` [`1a42780`](https://github.com/ljharb/get-intrinsic/commit/1a427806791e3ac11622661bb6bc0b381ae652d3)
- [meta] linter cleanup [`4ac4f62`](https://github.com/ljharb/get-intrinsic/commit/4ac4f62f3ecb9c4de47f12cc9a8626eaac23110a)
- [Dev deps] update `semver` [`2bb88e9`](https://github.com/ljharb/get-intrinsic/commit/2bb88e9a62117e1cc54f87e22292a58812585ba3)
- [meta] fix getOps script [`af6f7d2`](https://github.com/ljharb/get-intrinsic/commit/af6f7d2693a85c3b042a21574730357e3ccb6a2f)
- [meta] fix FUNDING.yml [`a5e6289`](https://github.com/ljharb/get-intrinsic/commit/a5e6289cef30ab21f1ba27653750b26daf731ff4)
- [meta] add github sponsorship [`13ff759`](https://github.com/ljharb/get-intrinsic/commit/13ff75943f5a59df6b06aff60c179af632baeb6e)
- [Deps] update `object-keys` [`195d439`](https://github.com/ljharb/get-intrinsic/commit/195d439a49ef9517c3ca1863a36ba471efac660f)
- [meta] fix getOps script [`b6d6434`](https://github.com/ljharb/get-intrinsic/commit/b6d643444471d6bc06d975ad65f2f65dcf2fda2a)
- [Deps] update `object-keys` [`6af6a10`](https://github.com/ljharb/get-intrinsic/commit/6af6a102446c420d7f8b2fd7b2e950440037391f)
- [Tests] temporarily allow node 0.6 to fail; segfaulting in travis [`d454a7a`](https://github.com/ljharb/get-intrinsic/commit/d454a7a38c55cee707dba5dd224c17b7a789d965)
- [Fix] `helpers/assertRecord`: remove `console.log` [`470a7ce`](https://github.com/ljharb/get-intrinsic/commit/470a7ce79b9c322db901cc0ac56fed93d8bfc4fd)

## [v1.13.0](https://github.com/ljharb/get-intrinsic/compare/v1.12.0...v1.13.0) - 2019-01-02

### Commits

- [Tests] add `getOps` to programmatically fetch abstract operation names [`586a35e`](https://github.com/ljharb/get-intrinsic/commit/586a35ed559db3571fb7525d4dfcb19d9a689ecd)
- [New] add ES2018 [`e7fd676`](https://github.com/ljharb/get-intrinsic/commit/e7fd6763ff7d45918b9ad8befcb794ee70d3bf49)
- [Tests] remove `jscs` [`2f7ce40`](https://github.com/ljharb/get-intrinsic/commit/2f7ce401b117118df4c0f00bdf41db5d549da4d2)
- [New] add ES2015/ES2016: EnumerableOwnNames; ES2017: EnumerableOwnProperties; ES2018: EnumerableOwnPropertyNames [`a8153d3`](https://github.com/ljharb/get-intrinsic/commit/a8153d3db64a02a021a9d385f0fc7e8b4b677bef)
- [New] add `assertRecord` helper [`3a2826d`](https://github.com/ljharb/get-intrinsic/commit/3a2826d6a927966178f4c5de5cedccae7c2ea350)
- [Tests] move descriptor factories to `values` helper [`7dcee9b`](https://github.com/ljharb/get-intrinsic/commit/7dcee9b927eebc3d8ecb13f18b2eed08c3e60d4a)
- [New] ES2015+: add `thisBooleanValue`, `thisNumberValue`, `thisStringValue`, `thisTimeValue` [`aea0e44`](https://github.com/ljharb/get-intrinsic/commit/aea0e44e4926438087f0a526f9dac783460544ea)
- [New] `ES2015+`: add `DefinePropertyOrThrow` [`be3cf5d`](https://github.com/ljharb/get-intrinsic/commit/be3cf5def49058ea8db5f7f303a366e2513a4d70)
- [New] `ES2015+`: add `DeletePropertyOrThrow` [`5cf4887`](https://github.com/ljharb/get-intrinsic/commit/5cf488703cbf9240f319dc158230734950d56de5)
- [Fix] add tests and a fix for `CreateMethodProperty` [`8f9c068`](https://github.com/ljharb/get-intrinsic/commit/8f9c068fcf9455f7b70351284c66fc7a0b2fffdf)
- [Tests] up to `node` `v11.6`, `v10.15`, `v8.15`, `v6.16` [`e6fb553`](https://github.com/ljharb/get-intrinsic/commit/e6fb55301078fabb711f9e99649f9a83b6bbece1)
- [New] `ES2015`+: Add `CreateMethodProperty` [`5e8d6ca`](https://github.com/ljharb/get-intrinsic/commit/5e8d6ca228af1888790a27fe62ae9bcd2404ef97)
- [Tests] ensure missing ops list is correct [`c12262d`](https://github.com/ljharb/get-intrinsic/commit/c12262d0d3c6ae54c2f9feffbdef198b1d385136)
- [Tests] up to `node` `v11.0`, `v10.12`, `v8.12` [`8f91211`](https://github.com/ljharb/get-intrinsic/commit/8f91211bc097d78af4b980fa1454c46155c855de)
- [Tests] remove unneeded jscs overrides [`bede79e`](https://github.com/ljharb/get-intrinsic/commit/bede79e06f6ccdcb34fad93bff51092c242a5c27)
- [Tests] up to `node` `v10.7` [`3218b61`](https://github.com/ljharb/get-intrinsic/commit/3218b61e3709a7c7ee862686530e0eb999d6fcae)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `tape` [`5944e17`](https://github.com/ljharb/get-intrinsic/commit/5944e175e0ec0b2a895eaad782e55079e0d64385)
- [patch] ES2018: remove unreleased `IsPropertyDescriptor` [`06dbc11`](https://github.com/ljharb/get-intrinsic/commit/06dbc117b9ab83db792a1128ef856625ddf89b0b)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `replace`, `tape` [`a093b0d`](https://github.com/ljharb/get-intrinsic/commit/a093b0de254b631c69a589a9285da4d9560e6917)
- [Tests] use `npm audit` instead of `nsp` [`d082818`](https://github.com/ljharb/get-intrinsic/commit/d082818dba85a93d2be3617458dc9a5a7f4ce6a5)
- [Dev Deps] update `eslint`, `safe-publish-latest`, `semver` [`9d6a36a`](https://github.com/ljharb/get-intrinsic/commit/9d6a36ad187d5c64567133f38e3e974d6bdbcf5e)
- [Deps] update `is-callable`, `has`, `object-keys` [`4695a34`](https://github.com/ljharb/get-intrinsic/commit/4695a34d87b793d28c46b9e5d680f5b873d479cc)
- [Dev Deps] update `semver`, `eslint` [`25944c5`](https://github.com/ljharb/get-intrinsic/commit/25944c5061cc5bcf790cfca6085fadeab546ac7a)
- [Deps] update `es-to-primitive` [`80bfd94`](https://github.com/ljharb/get-intrinsic/commit/80bfd946398a15f1722b25f1cf3d0d1a67145e72)
- [Dev Deps] update `eslint` [`bcb7dad`](https://github.com/ljharb/get-intrinsic/commit/bcb7dad289fa35c65f6c1a9ad11d59a33508bfd0)
- [Fix] remove duplicate abstract operation [`f42ce4c`](https://github.com/ljharb/get-intrinsic/commit/f42ce4c14a4be83e00d96eb1a57264338fcd9011)

## [v1.12.0](https://github.com/ljharb/get-intrinsic/compare/v1.11.0...v1.12.0) - 2018-05-31

### Commits

- [Docs] convert URLs to https [`ca86456`](https://github.com/ljharb/get-intrinsic/commit/ca864563ca263ee98457c510e90b4fc6f66a9014)
- [Dev Deps] update `eslint`, `nsp`, `object.assign`, `semver`, `tape` [`5eb3c9a`](https://github.com/ljharb/get-intrinsic/commit/5eb3c9a9cf7be687c90f0778f065028aa76d44a9)
- [New] add `GetIntrinsic` entry point [`10c9f99`](https://github.com/ljharb/get-intrinsic/commit/10c9f991b9be944f3263081c85fae397a934348b)
- Use GetIntrinsic [`cad40fa`](https://github.com/ljharb/get-intrinsic/commit/cad40fa7d03e9645726074bb497151929f415f7a)
- Reverting bad changes from 5eb3c9a9cf7be687c90f0778f065028aa76d44a9 [`c4657a5`](https://github.com/ljharb/get-intrinsic/commit/c4657a5d8751e4aeb2b2e74bac4b645c3fab8d38)
- [New] `ES2015`+: add `AdvanceStringIndex` [`4041660`](https://github.com/ljharb/get-intrinsic/commit/40416600db0778beda32f3afa8029bfb8f059a11)
- [New] `ES2015`+: add `ObjectCreate` [`e976362`](https://github.com/ljharb/get-intrinsic/commit/e976362f74ff283347cb5a766d2fd7b26e5a1001)
- [Tests] up to `node` `v10.0`, `v9.11`, `v8.11`, `v6.14`, `v4.9`; use `nvm install-latest-npm` [`20aae84`](https://github.com/ljharb/get-intrinsic/commit/20aae842fc8ec6218f9eb9e3419e0f6f682300f3)
- [Robustness]: `ES2015+`: ensure `Math.{abs,floor}` and `Function.call` are cached. [`2a1bc18`](https://github.com/ljharb/get-intrinsic/commit/2a1bc189d905cab3663e79be8acf484423dbd7e2)
- [Tests] add missing `NormalCompletion` abstract op [`5a263ed`](https://github.com/ljharb/get-intrinsic/commit/5a263ed8c4c51af246d4b7fd6957faba08bd4cae)
- [Tests] `GetIntrinsic`: increase coverage [`089eafd`](https://github.com/ljharb/get-intrinsic/commit/089eafd078226f2ce75cd397d9de2c71b8a2b6fe)
- [Robustness] `helpers/assign`: call-bind "has" [`8f5fae0`](https://github.com/ljharb/get-intrinsic/commit/8f5fae08422ce2de9177dcc65da20e5c38af8374)
- [Tests] fix the tests on node 10+, where match objects have "groups" [`1084499`](https://github.com/ljharb/get-intrinsic/commit/1084499ff0f7a2f91e77196277b1b55e548ae823)
- [Tests] improve error message for missing ops [`8c3c532`](https://github.com/ljharb/get-intrinsic/commit/8c3c532b96b0efe25a704c7e10252380d50a0b5d)
- [Dev Deps] update `replace` [`7fd0054`](https://github.com/ljharb/get-intrinsic/commit/7fd00541c871304c7860fbf368c4dc3ca1569d1f)
- [Tests] fix coverage thresholds [`5bcd3a0`](https://github.com/ljharb/get-intrinsic/commit/5bcd3a07ba48d8ee55b38647bc97af9abdc5ec9d)
- [Tests] add travis cache [`55a58b5`](https://github.com/ljharb/get-intrinsic/commit/55a58b5bd6bc6c3f696b143c25628e5b75b20d3d)
- [Dev Deps] update `eslint`; ignore `nyc` on greenkeeper since v11+ drops support for older nodes [`f0506b5`](https://github.com/ljharb/get-intrinsic/commit/f0506b5d526485635a973a185830b942e566e65f)
- [Tests] `ES2016`+: add `OrdinarySet` [`f2fa168`](https://github.com/ljharb/get-intrinsic/commit/f2fa16820a341b6684d3f09b43c7b888a3840246)
- [Tests] lowering coverage thresholds for individual runs [`7956878`](https://github.com/ljharb/get-intrinsic/commit/7956878619663d1d9fed16d12b8d789c10326375)
- [Tests] `ES2017`: add `IsSharedArrayBuffer` to list [`56b462e`](https://github.com/ljharb/get-intrinsic/commit/56b462e71682610ecdfa63ad4a06c7935482cc5e)
- [Tests] lowering coverage thresholds for individual runs [`929e5d1`](https://github.com/ljharb/get-intrinsic/commit/929e5d15982cd58677ffa20b7f386ea9db0358c3)
- [Tests] on `node` `v10.2` [`1f80100`](https://github.com/ljharb/get-intrinsic/commit/1f80100333d42fde0836ef44f5411612937d8a57)
- [Tests] on `node` `v10.1` [`9ee6ffa`](https://github.com/ljharb/get-intrinsic/commit/9ee6ffabf99126420dc5326dfc0a1dc18da83359)
- [Tests] use `object-inspect` instead of `util.format` for debug info [`c0cce8e`](https://github.com/ljharb/get-intrinsic/commit/c0cce8e41980f33bbe60926e3e7b1124146afca9)
- [Tests] make `node` `v0.6` required [`8eaf4cd`](https://github.com/ljharb/get-intrinsic/commit/8eaf4cd5b73dae50cbfbe4387e05122a661994da)
- [Tests] fix tests to preserve "groups" property [`f885332`](https://github.com/ljharb/get-intrinsic/commit/f8853324a630b58cd6f36311a52b179fdd712a29)

## [v1.11.0](https://github.com/ljharb/get-intrinsic/compare/v1.10.0...v1.11.0) - 2018-03-21

### Commits

- [New] `ES2015+`: add iterator abstract ops: [`2588b6b`](https://github.com/ljharb/get-intrinsic/commit/2588b6b416c805cf8ce2a2919ec767fdc5e353b3)
- [Tests] up to `node` `v9.8`, `v8.10`, `v6.13` [`225d552`](https://github.com/ljharb/get-intrinsic/commit/225d552af24840520c7176123fa619c39903ccec)
- [Dev Deps] update `eslint`, `nsp`, `object.assign`, `semver`, `tape` [`7f6db81`](https://github.com/ljharb/get-intrinsic/commit/7f6db81a26d8f54f0bb4f3e5ce820a82359b750d)

## [v1.10.0](https://github.com/ljharb/get-intrinsic/compare/v1.9.0...v1.10.0) - 2017-11-24

### Commits

- [New] ES2015+: `AdvanceStringIndex` [`5aa27f0`](https://github.com/ljharb/get-intrinsic/commit/5aa27f0e169ffaf7d22604de20a28759f51c9b68)
- [Tests] up to `node` `v9`, `v8.9`; use `nvm install-latest-npm`; pin included builds to LTS [`717aea6`](https://github.com/ljharb/get-intrinsic/commit/717aea68e2c88ad35fc8284b53c291d9a2c3551e)
- [Tests] up to `node` `v9.2`, `v6.12` [`052918d`](https://github.com/ljharb/get-intrinsic/commit/052918de7cd285b0078cab733ed0cfe6c33df4c4)
- [Dev Deps] update `eslint`, `nsp` [`d1887db`](https://github.com/ljharb/get-intrinsic/commit/d1887dbbde52b35749dc1f3012565705ab72db2a)
- [Tests] require node 0.6 to pass again [`b76fb1d`](https://github.com/ljharb/get-intrinsic/commit/b76fb1db56ed7797f79b438db6b3b222b602890a)
- [Dev Deps] update `eslint` [`be164d3`](https://github.com/ljharb/get-intrinsic/commit/be164d33866ca53c10399e524cfab6bd46d47cb3)

## [v1.9.0](https://github.com/ljharb/get-intrinsic/compare/v1.8.2...v1.9.0) - 2017-09-30

### Commits

- [Tests] consolidate duplicated tests. [`f2baca3`](https://github.com/ljharb/get-intrinsic/commit/f2baca3fb29d896aac6db57b66ef6b3808e96a8d)
- [New] add `ArraySpeciesCreate` [`8256b1b`](https://github.com/ljharb/get-intrinsic/commit/8256b1b5c62d950fb35eba92e07a90947f5bf7a1)
- [Tests] increase coverage [`d585ee3`](https://github.com/ljharb/get-intrinsic/commit/d585ee3e841a1322a323ae1c42e39c7c6b189d8d)
- [New] ES2015+: add `CreateDataProperty` and `CreateDataPropertyOrThrow` [`1003754`](https://github.com/ljharb/get-intrinsic/commit/10037548bea58cb3f53c4dd8313ce67bbea006af)
- [Fix] ES6+ ArraySpeciesCreate: properly handle non-array `originalArray`s. [`5dd1065`](https://github.com/ljharb/get-intrinsic/commit/5dd10658f783aac051a19147f62760a4985e7c76)
- [Dev Deps] update `nsp`, `eslint` [`9382bfa`](https://github.com/ljharb/get-intrinsic/commit/9382bfaf78fdd03e6795121c3352df89aecff331)

## [v1.8.2](https://github.com/ljharb/get-intrinsic/compare/v1.8.1...v1.8.2) - 2017-09-03

### Fixed

- [Fix] `es2015`+: `ToNumber`: provide the proper hint for Date objects. [`#27`](https://github.com/ljharb/get-intrinsic/issues/27)

### Commits

- [Dev Deps] update `eslint` [`cf4e870`](https://github.com/ljharb/get-intrinsic/commit/cf4e87065642b7d58871bdc85b4e6503c77cacc3)

## [v1.8.1](https://github.com/ljharb/get-intrinsic/compare/v1.8.0...v1.8.1) - 2017-08-30

### Fixed

- [Fix] ES2015+: `ToPropertyKey`: should return a symbol for Symbols. [`#26`](https://github.com/ljharb/get-intrinsic/issues/26)

### Commits

- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`9ae67a5`](https://github.com/ljharb/get-intrinsic/commit/9ae67a506d1482245177a961f06d88a97525f419)
- [Docs] github broke markdown parsing [`80a7af5`](https://github.com/ljharb/get-intrinsic/commit/80a7af5a1681280043bdfcda175b6895e8346666)
- [Deps] update `function-bind` [`1588dab`](https://github.com/ljharb/get-intrinsic/commit/1588dab2522d78ab9673448c998cac59f94cda15)

## [v1.8.0](https://github.com/ljharb/get-intrinsic/compare/v1.7.0...v1.8.0) - 2017-08-04

### Commits

- [New] move es6+ to es2015+; leave es6/es7 as aliases. [`99d9096`](https://github.com/ljharb/get-intrinsic/commit/99d9096f971192ad2b5b5a81a6eefd7ef1630415)
- [New] ES2015+: add `CompletePropertyDescriptor`, `Set`, `HasOwnProperty`, `HasProperty`, `IsConcatSpreadable`, `Invoke`, `CreateIterResultObject`, `RegExpExec` [`d53852e`](https://github.com/ljharb/get-intrinsic/commit/d53852e45fab6690ca1f42164dcc48b4208a09d3)
- [New] ES5+: add `IsPropertyDescriptor`, `IsAccessorDescriptor`, `IsDataDescriptor`, `IsGenericDescriptor`, `FromPropertyDescriptor`, `ToPropertyDescriptor` [`caa62da`](https://github.com/ljharb/get-intrinsic/commit/caa62dabfa9794584575160fdabf098b04c5589b)
- [New] add ES2017 [`ade044d`](https://github.com/ljharb/get-intrinsic/commit/ade044dd59e997e0ef138b990d5cb853409705cf)
- [Tests] use same lists of value types across tests; ensure tests are the same when ops are the same. [`047f761`](https://github.com/ljharb/get-intrinsic/commit/047f761cf30c946af0487ce13958eed9d5790bda)
- [New] add abstract operations data, by year (starting at 2015) [`55d610f`](https://github.com/ljharb/get-intrinsic/commit/55d610fb6c1bf9f1acf38d0241ce3214c8f39091)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `nsp`, `semver`, `tape` [`37c5272`](https://github.com/ljharb/get-intrinsic/commit/37c5272826c83430df99e79696c6f40f228f96a0)
- [Tests] add tests for missing and excess operations [`93efd66`](https://github.com/ljharb/get-intrinsic/commit/93efd669546bed6130fcc43b901d1764e726227b)
- [Tests] up to `node` `v8.2`, `v7.10`, `v6.11`, `v4.8`; newer npm breaks on older node [`ff32a32`](https://github.com/ljharb/get-intrinsic/commit/ff32a326c5518e58ab7f2f9640baa3f124938cd7)
- [Tests] add codecov [`311c416`](https://github.com/ljharb/get-intrinsic/commit/311c4163ca5dac913d27366fa7c6020d220ab2b3)
- [Tests] make IsRegExp tests consistent across editions. [`e48bcb7`](https://github.com/ljharb/get-intrinsic/commit/e48bcb7a1f8769aa4a930b695d474d1afc9451d1)
- [Tests] switch to `nyc` for code coverage [`2e97841`](https://github.com/ljharb/get-intrinsic/commit/2e9784171820b174c030bdcb91f0e114975769d1)
- [Tests] fix coverage [`60d5305`](https://github.com/ljharb/get-intrinsic/commit/60d53055cf24452c80afee4e5288219a175ed445)
- [Tests] ES2015: add ToNumber symbol tests [`6549464`](https://github.com/ljharb/get-intrinsic/commit/65494646a25b1817f85a79e4de35f097e6796f93)
- [Fix] assign helper only supports one source [`b397fb3`](https://github.com/ljharb/get-intrinsic/commit/b397fb3bea4765a9b325c156cdcfc3e5a11742ec)
- Only apps should have lockfiles. [`5c28e72`](https://github.com/ljharb/get-intrinsic/commit/5c28e723778f3327c459dc239a961ba7a897d9a3)
- [Dev Deps] update `nsp`, `eslint`, `@ljharb/eslint-config` [`5f09a50`](https://github.com/ljharb/get-intrinsic/commit/5f09a50f86e246575080227d87e9c96c139ef407)
- [Dev Deps] update `tape` [`2f0fc3c`](https://github.com/ljharb/get-intrinsic/commit/2f0fc3cd7569e258411522a294ed36d4cfd8674d)
- [Fix] es7/es2016: do not mutate ES6. [`c69b8a3`](https://github.com/ljharb/get-intrinsic/commit/c69b8a3d4cde726bf581b44fdc3cae3818f94e11)
- [Deps] update `is-regex` [`0600ae5`](https://github.com/ljharb/get-intrinsic/commit/0600ae5bf7fb58fd5c3034aeb28cd1ae3ec76a80)

## [v1.7.0](https://github.com/ljharb/get-intrinsic/compare/v1.6.1...v1.7.0) - 2017-01-22

### Commits

- [Tests] up to `node` `v7.4`; improve test matrix [`fe20c5b`](https://github.com/ljharb/get-intrinsic/commit/fe20c5b26c2d377f3ae1701283b38f016d139788)
- [New] `ES6`: Add `GetMethod` [`2edc976`](https://github.com/ljharb/get-intrinsic/commit/2edc976b3d4024b9be44da8f316413a1674d50fe)
- [New] ES6: Add `Get` [`3b375c5`](https://github.com/ljharb/get-intrinsic/commit/3b375c573a321318d17f117d3e62ced6b9d9e3d7)
- [New] `ES6`: Add `GetV` [`d72527e`](https://github.com/ljharb/get-intrinsic/commit/d72527e9d8f09e7c8b7aada0aa78e8da81caa673)
- [Dev Deps] update `tape`, `eslint`, `@ljharb/eslint-config` [`949ff34`](https://github.com/ljharb/get-intrinsic/commit/949ff344d78c3ae1cbe5d137a69df3bd0c94fbec)
- [Tests] up to `node` `v7.0`, `v6.9`, `v4.6`; improve test matrix [`31bf7e1`](https://github.com/ljharb/get-intrinsic/commit/31bf7e184a51624d88885bbec52cd7b1e1126b3f)
- [Dev Deps] update `tape`, `nsp`, `eslint`, `@ljharb/eslint-config`, `safe-publish-latest` [`0351537`](https://github.com/ljharb/get-intrinsic/commit/035153777213981e0e24f6cf007ffbd279384130)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`fce5110`](https://github.com/ljharb/get-intrinsic/commit/fce511086990f07e0febe0f3f2ae79215565399a)
- [Tests] up to `node` `v7.2` [`cca76e3`](https://github.com/ljharb/get-intrinsic/commit/cca76e388691b9f66774172cafb62fe6b5deccb2)

## [v1.6.1](https://github.com/ljharb/get-intrinsic/compare/v1.6.0...v1.6.1) - 2016-08-21

### Commits

- [Fix] IsConstructor should return true for `class` constructors. [`8fd9281`](https://github.com/ljharb/get-intrinsic/commit/8fd9281a87ae96f4292b7f2da5d7f162e8c65505)

## [v1.6.0](https://github.com/ljharb/get-intrinsic/compare/v1.5.1...v1.6.0) - 2016-08-20

### Commits

- [New] ES6: `SpeciesConstructor` [`f15a7f3`](https://github.com/ljharb/get-intrinsic/commit/f15a7f37ac8bd2c60039d37615afc1187a28cf2f)
- [New] ES5 / ES6: add `Type` [`2fae9c6`](https://github.com/ljharb/get-intrinsic/commit/2fae9c60b7dbccd45b478a54bcac455a774fc8e1)
- [Dev Deps] update `jscs`, `nsp`, `eslint`, `@ljharb/eslint-config`, `semver` [`bd992af`](https://github.com/ljharb/get-intrinsic/commit/bd992af6e97a7cab4c11167626b9aefea1dc093e)
- [Dev Deps] update `tape`, `jscs`, `nsp`, `eslint`, `@ljharb/eslint-config`, `semver` [`b783e29`](https://github.com/ljharb/get-intrinsic/commit/b783e299100b1dd12e2ac19c0da55f2ce68256c4)
- [Tests] up to `node` `v6.4`, `v4.5` [`e217b69`](https://github.com/ljharb/get-intrinsic/commit/e217b690f6f259f002104a8d3255b0dd352e0189)
- [Dev Deps] add `safe-publish-latest` [`b469ab3`](https://github.com/ljharb/get-intrinsic/commit/b469ab34ef0b16eefa15a908cd2ef2cd06539200)
- [Test] on `node` `v5.12` [`a1fa32f`](https://github.com/ljharb/get-intrinsic/commit/a1fa32f0de4134867c3f854544ecab095279fe8f)

## [v1.5.1](https://github.com/ljharb/get-intrinsic/compare/v1.5.0...v1.5.1) - 2016-05-30

### Fixed

- [Deps] update `es-to-primitive`, fix ES5 tests. [`#6`](https://github.com/ljharb/get-intrinsic/issues/6)

### Commits

- [Dev Deps] update `tape`, `jscs`, `nsp`, `eslint`, `@ljharb/eslint-config` [`4a0c1c3`](https://github.com/ljharb/get-intrinsic/commit/4a0c1c3ecac89f07970cbee7e029202848e862a4)
- [Dev Deps] update `jscs`, `nsp`, `eslint`, `@ljharb/eslint-config` [`f0f379a`](https://github.com/ljharb/get-intrinsic/commit/f0f379a596a2193cc20cb882ef4deb800503b6eb)
- [Dev Deps] update `jscs`, `nsp`, `eslint` [`2eec6cd`](https://github.com/ljharb/get-intrinsic/commit/2eec6cd5b51df7ac053808bfdfdc5ca0409cbe97)
- `s/  /\t/g` [`efe1104`](https://github.com/ljharb/get-intrinsic/commit/efe1104274a819b79a9f9584b66c5d80434ec8b7)
- [Dev Deps] update `jscs`, `eslint`, `@ljharb/eslint-config` [`e6738f6`](https://github.com/ljharb/get-intrinsic/commit/e6738f6a40c05ddcf032aa3f46a8ebfef697e3c8)
- [Dev Deps] update `jscs`, `eslint`, `@ljharb/eslint-config` [`5320c76`](https://github.com/ljharb/get-intrinsic/commit/5320c7604041ce28f98141e7cb362a00d65fdb6b)
- [Tests] up to `node` `v5.6`, `v4.3` [`67cb32b`](https://github.com/ljharb/get-intrinsic/commit/67cb32b07a91f0b5c2b9d418f99b9839b4072759)
- [Tests] up to `node` `v5.9`, `v4.4` [`3b86e4a`](https://github.com/ljharb/get-intrinsic/commit/3b86e4af1325dfb00d21a4307b842979faf8f104)
- [Refactor] create `isNaN` helper. [`dca4e0e`](https://github.com/ljharb/get-intrinsic/commit/dca4e0e2233d359eab713daaa25189ae61961dd9)
- [Tests] up to `node` `v6.2` [`6b3dab1`](https://github.com/ljharb/get-intrinsic/commit/6b3dab1ff7d2add734ee21d0b90547cfc0a415ea)
- [Tests] use pretest/posttest for linting/security [`a2b6a25`](https://github.com/ljharb/get-intrinsic/commit/a2b6a2557a9aab198ecae352e733d967f7bb543c)
- [Dev Deps] update `jscs`, `@ljharb/eslint-config` [`7b66c31`](https://github.com/ljharb/get-intrinsic/commit/7b66c31747e086ec28b3be3b6dee93931d3b68bf)
- [Fix] `ES.IsRegExp`: actually look up `Symbol.match` on the argument. [`8c7df66`](https://github.com/ljharb/get-intrinsic/commit/8c7df665ea7d9420f6496c4380e5577b1a9205d5)
- [Tests] on `node` `v5.10` [`9ca82a5`](https://github.com/ljharb/get-intrinsic/commit/9ca82a5cec4d6a197b2f147571e3f58f0d5e6978)
- [Deps] update `is-callable` [`c9be39b`](https://github.com/ljharb/get-intrinsic/commit/c9be39bf2b4426916516946dbe8801baceddb002)
- [Dev Deps] update `eslint` [`1bc8fc9`](https://github.com/ljharb/get-intrinsic/commit/1bc8fc94ed798f081e38dfee9081c4fc6ae68729)
- [Tests] on `node` `v5.7` [`78b08fb`](https://github.com/ljharb/get-intrinsic/commit/78b08fb0fe90423ccf0fa453e9ac315bdd329f99)
- [Deps] update `function-bind` [`e657bcb`](https://github.com/ljharb/get-intrinsic/commit/e657bcba7e0ba482c5795c099ad487cb0796d9ac)
- [Deps] update `is-callable` [`0a3fbb3`](https://github.com/ljharb/get-intrinsic/commit/0a3fbb368cc6fbedb22a6c2972314d063991fad8)

## [v1.5.0](https://github.com/ljharb/get-intrinsic/compare/v1.4.3...v1.5.0) - 2015-12-27

### Commits

- [Dev Deps] update `jscs`, `eslint`, `semver` [`8545989`](https://github.com/ljharb/get-intrinsic/commit/854598960fb8939dad45e9f432980f6a17ede598)
- [Dev Deps] update `jscs`, `nsp`, `eslint` [`ff2f1d8`](https://github.com/ljharb/get-intrinsic/commit/ff2f1d8ab7fa79b869425068b1c3203dde08f8e9)
- [Dev Deps] update `jscs`, `nsp`, `eslint`, `@ljharb/eslint-config` [`6ad543f`](https://github.com/ljharb/get-intrinsic/commit/6ad543ff06367954d2602cfdbf8fbc51f45cc6e1)
- [Dev Deps] update `tape`, `nsp` [`43394e1`](https://github.com/ljharb/get-intrinsic/commit/43394e1c689fc2d4c2f1fc289d5d6ccc881c1df5)
- [Tests] up to `node` `v5.3` [`2a1d7fe`](https://github.com/ljharb/get-intrinsic/commit/2a1d7fee4179b439ff63870a7eece404618f45b8)
- [Deps] update `es-to-primitive` [`80cd4d3`](https://github.com/ljharb/get-intrinsic/commit/80cd4d38cc86e329e43aa2ce93937da2642b759e)
- [Deps] update `is-callable` [`e65039f`](https://github.com/ljharb/get-intrinsic/commit/e65039fb7d18bfe2670fdd871f297716c5d72b40)
- [Tests] on `node` `v5.1` [`5687653`](https://github.com/ljharb/get-intrinsic/commit/5687653c6c073681ddf74eb1f7f0e4b165eb67d7)

## [v1.4.3](https://github.com/ljharb/get-intrinsic/compare/v1.4.2...v1.4.3) - 2015-11-04

### Fixed

- [Fix] `ES6.ToNumber`: should give `NaN` for explicitly signed hex strings. [`#4`](https://github.com/ljharb/get-intrinsic/issues/4)

### Commits

- [Refactor] group tests better. [`e8d8758`](https://github.com/ljharb/get-intrinsic/commit/e8d875826d8b0f5aab5b67a116fa607816e8d5b8)
- [Refactor] `ES6.ToNumber`: No need to double-trim. [`2538ea7`](https://github.com/ljharb/get-intrinsic/commit/2538ea7c14560a5a49146390023f3900812cdac1)
- [Tests] should still pass on `node` `v0.8` [`2555593`](https://github.com/ljharb/get-intrinsic/commit/2555593bf55a18f9a2db4a1ef6d1894dd26ae51d)

## [v1.4.2](https://github.com/ljharb/get-intrinsic/compare/v1.4.1...v1.4.2) - 2015-11-02

### Fixed

- [Fix] ensure `ES.ToNumber` trims whitespace, and does not trim non-whitespace. [`#3`](https://github.com/ljharb/get-intrinsic/issues/3)

## [v1.4.1](https://github.com/ljharb/get-intrinsic/compare/v1.4.0...v1.4.1) - 2015-10-31

### Fixed

- [Fix] ensure only 0-1 are valid binary and 0-7 are valid octal digits. [`#2`](https://github.com/ljharb/get-intrinsic/issues/2)

### Commits

- [Dev Deps] update `tape`, `jscs`, `nsp`, `eslint`, `@ljharb/eslint-config` [`576d57f`](https://github.com/ljharb/get-intrinsic/commit/576d57f47cc2e2be2393ba44dbd9f49df22ff53a)
- package.json: use object form of "authors", add "contributors" [`799bfef`](https://github.com/ljharb/get-intrinsic/commit/799bfef43be7743672add3bc79b559437ab4b890)
- [Tests] fix npm upgrades for older node versions [`ba2a70e`](https://github.com/ljharb/get-intrinsic/commit/ba2a70ed8346bbeccb413a4004456b91ffedb7d5)
- [Tests] on `node` `v5.0` [`eaf17a8`](https://github.com/ljharb/get-intrinsic/commit/eaf17a81244d595cb86ee50aa93503232bb5f52d)

## [v1.4.0](https://github.com/ljharb/get-intrinsic/compare/v1.3.2...v1.4.0) - 2015-10-17

### Commits

- Add `SameValueNonNumber` to ES7. [`095c0c9`](https://github.com/ljharb/get-intrinsic/commit/095c0c9696c59545d1ac9f470528da0b09e5b697)
- [Dev Deps] update `tape`, `jscs`, `eslint`, `@ljharb/eslint-config` [`58a67a3`](https://github.com/ljharb/get-intrinsic/commit/58a67a30bd7121c1932c254653e127dcd0458ef9)
- [Dev Deps] update `jscs`, `eslint`, `@ljharb/eslint-config` [`96050f2`](https://github.com/ljharb/get-intrinsic/commit/96050f2c9ed3513a91ced725eddcfced7116ec6e)
- [Tests] on `node` `v4.2` [`ee16fbe`](https://github.com/ljharb/get-intrinsic/commit/ee16fbe166682f843dc58ce85590bd1343d19061)
- [Deps] update `is-callable` [`785f0bf`](https://github.com/ljharb/get-intrinsic/commit/785f0bfad5f700020df8271b33a9377a3296d58c)

## [v1.3.2](https://github.com/ljharb/get-intrinsic/compare/v1.3.1...v1.3.2) - 2015-09-26

### Commits

- Fix `IsRegExp` to properly handle `Symbol.match`, per spec. [`ab96c1c`](https://github.com/ljharb/get-intrinsic/commit/ab96c1c31ba975b89eb9e6f62c98eeb0270c0cac)
- [Dev Deps] update `jscs`, `nsp`, `eslint`, `@ljharb/eslint-config`, `semver` [`490a8ba`](https://github.com/ljharb/get-intrinsic/commit/490a8bad458fee8f2ebb46821571ae17d71fe5ee)
- [Tests] up to `io.js` `v3.3`, `node` `v4.1` [`922af35`](https://github.com/ljharb/get-intrinsic/commit/922af3599fc302b7c5fefff5262b2c4809c8b868)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`7e1186a`](https://github.com/ljharb/get-intrinsic/commit/7e1186a9e88f9baf8c475959cbaa5028a9a0e3e0)
- [Dev Deps] update `tape` [`d3f4f33`](https://github.com/ljharb/get-intrinsic/commit/d3f4f33f891927173ac716ddf24c125c2aece65e)

## [v1.3.1](https://github.com/ljharb/get-intrinsic/compare/v1.3.0...v1.3.1) - 2015-08-15

### Commits

- Ensure that objects that `toString` to a binary or octal literal also convert properly. [`34d0f5b`](https://github.com/ljharb/get-intrinsic/commit/34d0f5b30f09189fed2dbf3324c4729355f7407b)

## [v1.3.0](https://github.com/ljharb/get-intrinsic/compare/v1.2.2...v1.3.0) - 2015-08-15

### Commits

- Update `jscs`, `eslint`, `@ljharb/eslint-config` [`da1eb8c`](https://github.com/ljharb/get-intrinsic/commit/da1eb8c2637c4003570e515471680549bba8d5a8)
- [New] ES6’s ToNumber now supports binary and octal literals. [`c81b8ec`](https://github.com/ljharb/get-intrinsic/commit/c81b8ec7873fb55a55a835675dd7db1aeb39484b)
- [Dev Deps] update `jscs` [`b351a07`](https://github.com/ljharb/get-intrinsic/commit/b351a07ac2022ca0a2bc185a91b606ec6e5653c7)
- Update `tape`, `eslint` [`64ddee9`](https://github.com/ljharb/get-intrinsic/commit/64ddee9211d11b86d35893d10e5ed01d52bce544)
- [Dev Deps] update `tape` [`4d93933`](https://github.com/ljharb/get-intrinsic/commit/4d9393323bc6cc5df198ca9c9ff4be9fb296268e)
- Switch from vb.teelaun.ch to versionbadg.es for the npm version badge SVG. [`164831e`](https://github.com/ljharb/get-intrinsic/commit/164831e97c8f39645830c69951ce459bf195be86)
- Update `tape` [`6704daa`](https://github.com/ljharb/get-intrinsic/commit/6704daad3673f16be5c30f3bd4f274383458c609)
- Test on `io.js` `v2.5` [`d846f8f`](https://github.com/ljharb/get-intrinsic/commit/d846f8fbf90785c204dd5e815716c1cc1d0f2d77)
- Test on `io.js` `v3.0` [`84d008e`](https://github.com/ljharb/get-intrinsic/commit/84d008ec77bb157ef7bde9949850316655c01ab9)

## [v1.2.2](https://github.com/ljharb/get-intrinsic/compare/v1.2.1...v1.2.2) - 2015-07-28

### Commits

- Use my personal shared `eslint` config. [`8ce5117`](https://github.com/ljharb/get-intrinsic/commit/8ce511774378309dd13837e6473d2e39e8c81428)
- Update `eslint` [`9bdef0e`](https://github.com/ljharb/get-intrinsic/commit/9bdef0e57b33b8f43c873dded948d9ee2453cf58)
- Update `eslint`, `jscs`, `tape`, `semver` [`4166e79`](https://github.com/ljharb/get-intrinsic/commit/4166e7945a2009157ce6a40002a4b0ccef2471c4)
- Update `eslint`, `nsp`, `semver` [`edfbec0`](https://github.com/ljharb/get-intrinsic/commit/edfbec00d53647f683516e141ade99087e6c1f77)
- Update `jscs`, `eslint`, `covert`, `semver` [`dedefc3`](https://github.com/ljharb/get-intrinsic/commit/dedefc341e425cae9a4d7adcf1f05d295c2d55de)
- Test up to `io.js` `v2.3` [`f720287`](https://github.com/ljharb/get-intrinsic/commit/f7202878d35af09f313755b1503ce9a5982e226d)
- Add some more ES6.ToString tests. [`1199a5e`](https://github.com/ljharb/get-intrinsic/commit/1199a5e480008c50281af96172e6c2d981991b42)
- Update `tape`, `eslint`, `semver` [`e0ac913`](https://github.com/ljharb/get-intrinsic/commit/e0ac913b7a3dbfd57847abf7f9c591c0380c6ca0)
- Test on latest `io.js` versions. [`e018b38`](https://github.com/ljharb/get-intrinsic/commit/e018b3844d2715b0231b18265dec68f52a98bb34)
- Test on `io.js` `v2.4` [`4cdd2cb`](https://github.com/ljharb/get-intrinsic/commit/4cdd2cbda257e2f281c423e5b1cb7666dde3b073)
- Update `eslint` [`fa07aec`](https://github.com/ljharb/get-intrinsic/commit/fa07aec6ae2803f080971152206d5dd8e02449c3)
- Test on `io.js` `v2.1` [`edfc1fd`](https://github.com/ljharb/get-intrinsic/commit/edfc1fdbfb8ba59a8450b4fe3e75508c2734281a)
- Test up to `io.js` `v2.0` [`4b73b2a`](https://github.com/ljharb/get-intrinsic/commit/4b73b2a7e4fd8dd7d48140c8bb0f698b655fc839)
- Both `ES5.CheckObjectCoercible` and `ES6.RequireObjectCoercible` return the value if they don't throw. [`d72e869`](https://github.com/ljharb/get-intrinsic/commit/d72e869f16f0ae5603192632658efd0bdc336ad0)

## [v1.2.1](https://github.com/ljharb/get-intrinsic/compare/v1.2.0...v1.2.1) - 2015-03-20

### Commits

- Fix isFinite helper. [`0d4f914`](https://github.com/ljharb/get-intrinsic/commit/0d4f914f87bfefb04fb7a4650eb51da58c00c354)

## [v1.2.0](https://github.com/ljharb/get-intrinsic/compare/v1.1.1...v1.2.0) - 2015-03-19

### Commits

- Use `es-to-primitive` [`c554cf5`](https://github.com/ljharb/get-intrinsic/commit/c554cf5bcd7f41ffee8637b9109f9f9cb651acab)
- Test on latest `io.js` versions; allow failures on all but 2 latest `node`/`io.js` versions. [`7941eba`](https://github.com/ljharb/get-intrinsic/commit/7941ebaf01f5cf2ccdca17c5131535a7583e04e0)

## [v1.1.1](https://github.com/ljharb/get-intrinsic/compare/v1.1.0...v1.1.1) - 2015-03-19

### Commits

- Update `eslint`, `editorconfig-tools`, `semver` [`84554ec`](https://github.com/ljharb/get-intrinsic/commit/84554eccb4b57d5c6da94203d439b0fc8200b1f3)
- Update `eslint`, `nsp` [`b9308e7`](https://github.com/ljharb/get-intrinsic/commit/b9308e75b335d91e1d65b2d7b30cd26274b8cbbc)
- Fixing isPrimitive check. [`5affc7d`](https://github.com/ljharb/get-intrinsic/commit/5affc7d416329e1eed574c818879a31f2fb547c7)
- Fixing `make release` [`73d9f1f`](https://github.com/ljharb/get-intrinsic/commit/73d9f1f21af3b282becd6b62a9223e1c1789bccc)
- Update `eslint` [`0c60789`](https://github.com/ljharb/get-intrinsic/commit/0c607890e0b02496a19a0a1ff23f6f4731c309dd)

## [v1.1.0](https://github.com/ljharb/get-intrinsic/compare/v1.0.2...v1.1.0) - 2015-02-17

### Commits

- Moving the ES6 methods to their own internal module. [`01d7e1b`](https://github.com/ljharb/get-intrinsic/commit/01d7e1b06e6829273f50b89584d6bddeca91a9af)
- Add ES7 export (non-default). [`e1f4455`](https://github.com/ljharb/get-intrinsic/commit/e1f4455762b63a3a0c66b785b1af9018d1b24222)
- Add ES6 tests [`eea6300`](https://github.com/ljharb/get-intrinsic/commit/eea63002b5d29399060f75b44653fd530f3c9011)
- Implementation. [`0a64fb8`](https://github.com/ljharb/get-intrinsic/commit/0a64fb86e98dc5ed130358d69c657c8aaaf0b79a)
- Dotfiles. [`fd70ce7`](https://github.com/ljharb/get-intrinsic/commit/fd70ce7800a2bec48d1273cf5bfeaeae5d689b79)
- Moving the ES5 methods to their own internal module. [`5ee4426`](https://github.com/ljharb/get-intrinsic/commit/5ee44265ed3704f2f68d35c58b02e5bec9dee746)
- Add ES5 tests [`2bff2bd`](https://github.com/ljharb/get-intrinsic/commit/2bff2bd3ecee99be72603dbfd0d3867d4b0fe95e)
- Creating a bunch of internal helper modules. [`1969d6f`](https://github.com/ljharb/get-intrinsic/commit/1969d6f9a1e6f8cc095482c8bd17a86f1e44ca91)
- package.json [`4d59162`](https://github.com/ljharb/get-intrinsic/commit/4d59162ff8dff9847fee58c1237ebfc3a7e53fdb)
- Add `make release`, `make list`, `make test`. [`aa2bc63`](https://github.com/ljharb/get-intrinsic/commit/aa2bc635b3ec283ec63d95fc58b76094fbc5b2d8)
- README. [`3a856b2`](https://github.com/ljharb/get-intrinsic/commit/3a856b2a7e95bf5e23471d9db63aae25450944b4)
- LICENSE [`007e224`](https://github.com/ljharb/get-intrinsic/commit/007e2246f7a0edf4086c90f095e0ca4482169977)
- All grade A-supported `node`/`iojs` versions now ship with an `npm` that understands `^`. [`b22c912`](https://github.com/ljharb/get-intrinsic/commit/b22c912070775d96dbaf6716553a48e3bcff53bb)
- Tests for main ES object. [`2b85940`](https://github.com/ljharb/get-intrinsic/commit/2b85940c00747827877a15cbaa38b7f21fb809ae)
- Update `tape`, `jscs`, `nsp`, `eslint` [`f83ada2`](https://github.com/ljharb/get-intrinsic/commit/f83ada228ec0f685538a888bf23f096bfed8a6f3)
- Use `is-callable` instead of this internal function. [`b8b2d51`](https://github.com/ljharb/get-intrinsic/commit/b8b2d51056a93e73925ff6ade79e176a973ceda2)
- Run `travis-ci` tests on `iojs` and `node` v0.12; allow 0.8 failures. [`91dfb1a`](https://github.com/ljharb/get-intrinsic/commit/91dfb1abd6aa287acae7dc6375e76bd5b2d7741d)
- Update `tape`, `jscs` [`c2e81bd`](https://github.com/ljharb/get-intrinsic/commit/c2e81bd61d36d88ad289580fcf5efc69b0b13108)
- Update `eslint` [`adf41d8`](https://github.com/ljharb/get-intrinsic/commit/adf41d8e68c640dd4f161bc647e16440bf714d9f)
- Test on `iojs-v1.2`. [`5911eef`](https://github.com/ljharb/get-intrinsic/commit/5911eef8b9dc4a332bccc3f1aae728790dc9c9ab)
- Initial commit [`8721dea`](https://github.com/ljharb/get-intrinsic/commit/8721dea87fb406a307c770c9747b4b5a1cbfe236)

## [v1.0.2](https://github.com/ljharb/get-intrinsic/compare/v1.0.1...v1.0.2) - 2020-12-17

### Commits

- [Fix] Throw for non‑existent intrinsics [`68f873b`](https://github.com/ljharb/get-intrinsic/commit/68f873b013c732a05ad6f5fc54f697e55515461b)
- [Fix] Throw for non‑existent segments in the intrinsic path [`8325dee`](https://github.com/ljharb/get-intrinsic/commit/8325deee43128f3654d3399aa9591741ebe17b21)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `aud`, `has-bigints`, `object-inspect` [`0c227a7`](https://github.com/ljharb/get-intrinsic/commit/0c227a7d8b629166f25715fd242553892e458525)
- [meta] do not lint coverage output [`70d2419`](https://github.com/ljharb/get-intrinsic/commit/70d24199b620043cd9110fc5f426d214ebe21dc9)

## [v1.0.1](https://github.com/ljharb/get-intrinsic/compare/v1.0.0...v1.0.1) - 2020-10-30

### Commits

- [Tests] gather coverage data on every job [`d1d280d`](https://github.com/ljharb/get-intrinsic/commit/d1d280dec714e3f0519cc877dbcb193057d9cac6)
- [Fix] add missing dependencies [`5031771`](https://github.com/ljharb/get-intrinsic/commit/5031771bb1095b38be88ce7c41d5de88718e432e)
- [Tests] use `es-value-fixtures` [`af48765`](https://github.com/ljharb/get-intrinsic/commit/af48765a23c5323fb0b6b38dbf00eb5099c7bebc)

## v1.0.0 - 2020-10-29

### Commits

- Implementation [`bbce57c`](https://github.com/ljharb/get-intrinsic/commit/bbce57c6f33d05b2d8d3efa273ceeb3ee01127bb)
- Tests [`17b4f0d`](https://github.com/ljharb/get-intrinsic/commit/17b4f0d56dea6b4059b56fc30ef3ee4d9500ebc2)
- Initial commit [`3153294`](https://github.com/ljharb/get-intrinsic/commit/31532948de363b0a27dd9fd4649e7b7028ec4b44)
- npm init [`fb326c4`](https://github.com/ljharb/get-intrinsic/commit/fb326c4d2817c8419ec31de1295f06bb268a7902)
- [meta] add Automatic Rebase and Require Allow Edits workflows [`48862fb`](https://github.com/ljharb/get-intrinsic/commit/48862fb2508c8f6a57968e6d08b7c883afc9d550)
- [meta] add `auto-changelog` [`5f28ad0`](https://github.com/ljharb/get-intrinsic/commit/5f28ad019e060a353d8028f9f2591a9cc93074a1)
- [meta] add "funding"; create `FUNDING.yml` [`c2bbdde`](https://github.com/ljharb/get-intrinsic/commit/c2bbddeba73a875be61484ee4680b129a6d4e0a1)
- [Tests] add `npm run lint` [`0a84b98`](https://github.com/ljharb/get-intrinsic/commit/0a84b98b22b7cf7a748666f705b0003a493c35fd)
- Only apps should have lockfiles [`9586c75`](https://github.com/ljharb/get-intrinsic/commit/9586c75866c1ee678e4d5d4dbbdef6997e511b05)
