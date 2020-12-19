const { core } = require('./cli-flags');

// Contains an array of strings with core cli flags and their aliases
const names = core
    .map(({ alias, name }) => {
        if (name === 'help') return [];
        if (alias) {
            return [`--${name}`, `-${alias}`];
        }
        return [`--${name}`];
    })
    .reduce((arr, val) => arr.concat(val), []);

module.exports = { names };
