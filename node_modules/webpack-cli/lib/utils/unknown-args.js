const commandNames = require('./commands').names;
const flagNames = require('./core-flags').names;

module.exports = {
    commands: [...commandNames],
    flags: [...flagNames],
    allNames: [...commandNames, ...flagNames],
    hasUnknownArgs: (args, names) =>
        args.filter((e) => !names.includes(e) && !e.includes('color') && e !== 'version' && e !== '-v' && !e.includes('help')),
};
