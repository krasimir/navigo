/**
 * Resolve flags which deal with compilation stats
 * @param {args} args - Parsed args passed to CLI
 */
const resolveStats = (args) => {
    const { stats, json } = args;

    const finalOptions = {
        options: {},
        outputOptions: {},
    };

    if (stats !== undefined) {
        finalOptions.options.stats = stats;
    }
    if (json) {
        finalOptions.outputOptions.json = json;
    }
    return finalOptions;
};

module.exports = resolveStats;
