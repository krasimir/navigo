# webpack-cli info

[![NPM Downloads][downloads]][downloads-url]

## Description

This package returns a set of information related to the local environment.

## Installation

```bash
#npm
npm i -D @webpack-cli/info

#yarn
yarn add @webpack-cli/info -D

#npx
npx webpack info [options]

```

## Usage

### Args / Flags

#### Output format

| Flag                            | Description                           | Type       |
| ------------------------------- | ------------------------------------- | ---------- |
| `--output < json or markdown >` | To get the output in specified format | [ string ] |

_Not supported for config_

#### Options

| Flag        | Description                                | Type        |
| ----------- | ------------------------------------------ | ----------- |
| `--help`    | Show help                                  | [ boolean ] |
| `--version` | Show version number of `@webpack-cli/info` | [ boolean ] |

### Node

```js
const info = require('@webpack-cli/info').default;

async function wrapperFunc() {
    await info({
        /* Custom Config */
    });
}
wrapperFunc();
```

#### Custom config

> Config has higher precedence than system flags

```json
// Config's relative path
{

    "config": [string]
}
    // System info
{
    "binaries": [boolean],
    "system": [boolean],
    "browsers": [boolean],
    "npmg": [boolean],
    "npmPackages": [boolean],
}
```

The function returns `string` for `system` info, and returns an array of strings (`string[]`) for `config`

### CLI (via `webpack-cli`)

```bash
webpack-cli info --FLAGS #Flags are optional for custom output
```

[downloads]: https://img.shields.io/npm/dm/@webpack-cli/info.svg
[downloads-url]: https://www.npmjs.com/package/@webpack-cli/info
