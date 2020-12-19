const { yellow, cyan } = require('colorette');
const logger = require('./logger');
const { packageExists } = require('./package-exists');
const { promptInstallation } = require('./prompt-installation');

const packagePrefix = '@webpack-cli';

const run = async (name, ...args) => {
    const scopeName = packagePrefix + '/' + name;

    let pkgLoc = packageExists(scopeName);

    if (!pkgLoc) {
        try {
            pkgLoc = await promptInstallation(`${scopeName}`, () => {
                logger.error(`The command moved into a separate package: ${yellow(scopeName)}\n`);
            });
        } catch (err) {
            logger.error(`Action Interrupted, use ${cyan('webpack-cli help')} to see possible commands.`);
        }
    }

    if (!pkgLoc) {
        return;
    }

    let mod = require(scopeName);

    if (mod.default) {
        mod = mod.default;
    }

    return mod(...args);
};

module.exports = run;
