const logger = require('../utils/logger');
const { defaultCommands } = require('../utils/commands');
const { isCommandUsed } = require('../utils/arg-utils');
const { commands, allNames, hasUnknownArgs } = require('../utils/unknown-args');

const outputVersion = (args) => {
    // This is used to throw err when there are multiple command along with version
    const commandsUsed = args.filter((val) => commands.includes(val));

    // The command with which version is invoked
    const commandUsed = isCommandUsed(args);
    const invalidArgs = hasUnknownArgs(args, allNames);
    if (commandsUsed && commandsUsed.length === 1 && invalidArgs.length === 0) {
        try {
            if ([commandUsed.alias, commandUsed.name].some((pkg) => commandsUsed.includes(pkg))) {
                const { name, version } = require(`@webpack-cli/${defaultCommands[commandUsed.name]}/package.json`);
                logger.raw(`\n${name} ${version}`);
            } else {
                const { name, version } = require(`${commandUsed.name}/package.json`);
                logger.raw(`\n${name} ${version}`);
            }
        } catch (e) {
            logger.error('Error: External package not found.');
            process.exit(2);
        }
    }

    if (commandsUsed.length > 1) {
        logger.error('You provided multiple commands. Please use only one command at a time.\n');
        process.exit(2);
    }

    if (invalidArgs.length > 0) {
        const argType = invalidArgs[0].startsWith('-') ? 'option' : 'command';
        logger.error(`Error: Invalid ${argType} '${invalidArgs[0]}'.`);
        logger.info('Run webpack --help to see available commands and arguments.\n');
        process.exit(2);
    }

    const pkgJSON = require('../../package.json');
    const webpack = require('webpack');
    logger.raw(`\nwebpack-cli ${pkgJSON.version}`);
    logger.raw(`\nwebpack ${webpack.version}\n`);
};

module.exports = outputVersion;
