const { commands } = require('./cli-flags');

const hyphenToUpperCase = (name) => {
    if (!name) {
        return name;
    }
    return name.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
};

const arrayToObject = (arr) => {
    if (!arr) {
        return;
    }
    return arr.reduce((result, currentItem) => {
        const key = Object.keys(currentItem)[0];
        result[hyphenToUpperCase(key)] = currentItem[key];
        return result;
    }, {});
};

const isCommandUsed = (args) =>
    commands.find((cmd) => {
        return args.includes(cmd.name) || args.includes(cmd.alias);
    });

module.exports = {
    arrayToObject,
    hyphenToUpperCase,
    isCommandUsed,
};
