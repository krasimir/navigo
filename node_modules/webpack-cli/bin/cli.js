#!/usr/bin/env node

'use strict';

require('v8-compile-cache');

const importLocal = require('import-local');
const runCLI = require('../lib/bootstrap');
const { yellow } = require('colorette');
const { error, success } = require('../lib/utils/logger');
const { packageExists } = require('../lib/utils/package-exists');
const { promptInstallation } = require('../lib/utils/prompt-installation');

// Prefer the local installation of `webpack-cli`
if (importLocal(__filename)) {
    return;
}

process.title = 'webpack';

const [, , ...rawArgs] = process.argv;

if (packageExists('webpack')) {
    runCLI(rawArgs);
} else {
    promptInstallation('webpack -W', () => {
        error(`It looks like ${yellow('webpack')} is not installed.`);
    })
        .then(() => {
            success(`${yellow('webpack')} was installed sucessfully.`);

            runCLI(rawArgs);
        })
        .catch(() => {
            error(`Action Interrupted, Please try once again or install ${yellow('webpack')} manually.`);

            process.exit(2);
        });
}
