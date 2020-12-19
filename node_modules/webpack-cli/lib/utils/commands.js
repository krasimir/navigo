const { commands } = require('./cli-flags');

const defaultCommands = {
    init: 'init',
    loader: 'generate-loader',
    plugin: 'generate-plugin',
    info: 'info',
    migrate: 'migrate',
    serve: 'serve',
};

// Contains an array of strings with commands and their aliases that the cli supports
const names = commands
    .map(({ alias, name }) => {
        if (alias) {
            return [name, alias];
        }
        return [name];
    })
    .reduce((arr, val) => arr.concat(val), []);

module.exports = {
    defaultCommands,
    names,
};
