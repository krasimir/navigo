const commander = require('commander');
const logger = require('./logger');
const { commands } = require('./cli-flags');
const runHelp = require('../groups/runHelp');
const runVersion = require('../groups/runVersion');
const { defaultCommands } = require('./commands');

/**
 *  Creates Argument parser corresponding to the supplied options
 *  parse the args and return the result
 *
 * @param {object[]} options Array of objects with details about flags
 * @param {string[]} args process.argv or it's subset
 * @param {boolean} argsOnly false if all of process.argv has been provided, true if
 * args is only a subset of process.argv that removes the first couple elements
 */
const argParser = (options, args, argsOnly = false, name = '') => {
    const parser = new commander.Command();

    // Set parser name
    parser.name(name);
    parser.storeOptionsAsProperties(false);

    commands.reduce((parserInstance, cmd) => {
        parser
            .command(cmd.name)
            .alias(cmd.alias)
            .description(cmd.description)
            .usage(cmd.usage)
            .allowUnknownOption(true)
            .action(async () => {
                const cliArgs = args.slice(args.indexOf(cmd.name) + 1 || args.indexOf(cmd.alias) + 1);

                return await require('./resolve-command')(defaultCommands[cmd.name], ...cliArgs);
            });

        return parser;
    }, parser);

    // Prevent default behavior
    parser.on('command:*', () => {});

    // Use customized help output
    if (args.includes('--help') || args.includes('help')) {
        runHelp(args);
        process.exit(0);
    }

    // Use Customized version
    if (args.includes('--version') || args.includes('version') || args.includes('-v')) {
        runVersion(args);
        process.exit(0);
    }

    // Allow execution if unknown arguments are present
    parser.allowUnknownOption(true);

    // Register options on the parser
    options.reduce((parserInstance, option) => {
        let optionType = option.type;
        let isStringOrBool = false;

        if (Array.isArray(optionType)) {
            // filter out duplicate types
            optionType = optionType.filter((type, index) => {
                return optionType.indexOf(type) === index;
            });

            // the only multi type currently supported is String and Boolean,
            // if there is a case where a different multi type is needed it
            // must be added here
            if (optionType.length === 0) {
                // if no type is provided in the array fall back to Boolean
                optionType = Boolean;
            } else if (optionType.length === 1 || optionType.length > 2) {
                // treat arrays with 1 or > 2 args as a single type
                optionType = optionType[0];
            } else {
                // only String and Boolean multi type is supported
                if (optionType.includes(Boolean) && optionType.includes(String)) {
                    isStringOrBool = true;
                } else {
                    optionType = optionType[0];
                }
            }
        }

        const flags = option.alias ? `-${option.alias}, --${option.name}` : `--${option.name}`;

        let flagsWithType = flags;

        if (isStringOrBool) {
            // commander recognizes [value] as an optional placeholder,
            // making this flag work either as a string or a boolean
            flagsWithType = `${flags} [value]`;
        } else if (optionType !== Boolean) {
            // <value> is a required placeholder for any non-Boolean types
            flagsWithType = `${flags} <value>`;
        }

        if (isStringOrBool || optionType === Boolean || optionType === String) {
            if (option.multiple) {
                // a multiple argument parsing function
                const multiArg = (value, previous = []) => previous.concat([value]);
                parserInstance.option(flagsWithType, option.description, multiArg, option.defaultValue).action(() => {});
            } else if (option.multipleType) {
                // for options which accept multiple types like env
                // so you can do `--env platform=staging --env production`
                // { platform: "staging", production: true }
                const multiArg = (value, previous = {}) => {
                    // this ensures we're only splitting by the first `=`
                    const [allKeys, val] = value.split(/=(.+)/, 2);
                    const splitKeys = allKeys.split(/\.(?!$)/);

                    let prevRef = previous;

                    splitKeys.forEach((someKey, index) => {
                        if (!prevRef[someKey]) {
                            prevRef[someKey] = {};
                        }

                        if ('string' === typeof prevRef[someKey]) {
                            prevRef[someKey] = {};
                        }

                        if (index === splitKeys.length - 1) {
                            prevRef[someKey] = val || true;
                        }

                        prevRef = prevRef[someKey];
                    });

                    return previous;
                };
                parserInstance.option(flagsWithType, option.description, multiArg, option.defaultValue).action(() => {});
            } else {
                // Prevent default behavior for standalone options
                parserInstance.option(flagsWithType, option.description, option.defaultValue).action(() => {});
            }
        } else if (optionType === Number) {
            // this will parse the flag as a number
            parserInstance.option(flagsWithType, option.description, Number, option.defaultValue);
        } else {
            // in this case the type is a parsing function
            parserInstance.option(flagsWithType, option.description, optionType, option.defaultValue).action(() => {});
        }

        if (option.negative) {
            // commander requires explicitly adding the negated version of boolean flags
            const negatedFlag = `--no-${option.name}`;
            parserInstance.option(negatedFlag, `negates ${option.name}`).action(() => {});
        }

        return parserInstance;
    }, parser);

    // if we are parsing a subset of process.argv that includes
    // only the arguments themselves (e.g. ['--option', 'value'])
    // then we need from: 'user' passed into commander parse
    // otherwise we are parsing a full process.argv
    // (e.g. ['node', '/path/to/...', '--option', 'value'])
    const parseOptions = argsOnly ? { from: 'user' } : {};

    const result = parser.parse(args, parseOptions);
    const opts = result.opts();
    const unknownArgs = result.args;

    args.forEach((arg) => {
        const flagName = arg.slice(5);
        const option = options.find((opt) => opt.name === flagName);
        const flag = `--${flagName}`;
        const flagUsed = args.includes(flag) && !unknownArgs.includes(flag);
        let alias = '';
        let aliasUsed = false;

        if (option && option.alias) {
            alias = `-${option.alias}`;
            aliasUsed = args.includes(alias) && !unknownArgs.includes(alias);
        }

        // this is a negated flag that is not an unknown flag, but the flag
        // it is negating was also provided
        if (arg.startsWith('--no-') && (flagUsed || aliasUsed) && !unknownArgs.includes(arg)) {
            logger.warn(
                `You provided both ${
                    flagUsed ? flag : alias
                } and ${arg}. We will use only the last of these flags that you provided in your CLI arguments`,
            );
        }
    });

    Object.keys(opts).forEach((key) => {
        if (opts[key] === undefined) {
            delete opts[key];
        }
    });

    return {
        unknownArgs,
        opts,
    };
};

module.exports = argParser;
