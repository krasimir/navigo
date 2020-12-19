const { core, groups } = require('../utils/cli-flags');

const WEBPACK_OPTION_FLAGS = core
    .filter((coreFlag) => {
        return coreFlag.group === groups.BASIC_GROUP;
    })
    .reduce((result, flagObject) => {
        result.push(flagObject.name);
        if (flagObject.alias) {
            result.push(flagObject.alias);
        }
        return result;
    }, []);

function resolveArgs(args) {
    const finalOptions = {
        options: {},
        outputOptions: {},
    };
    Object.keys(args).forEach((arg) => {
        if (WEBPACK_OPTION_FLAGS.includes(arg)) {
            finalOptions.outputOptions[arg] = args[arg];
        }
        if (arg === 'devtool') {
            finalOptions.options.devtool = args[arg];
        }
        if (arg === 'name') {
            finalOptions.options.name = args[arg];
        }
        if (arg === 'watch') {
            finalOptions.options.watch = true;
        }
        if (arg === 'entry') {
            finalOptions.options[arg] = args[arg];
        }
    });
    return finalOptions;
}

module.exports = resolveArgs;
