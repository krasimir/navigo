const path = require('path');

/**
 * Resolves the output flag
 * @param {args} args - Parsed arguments passed to the CLI
 */
const resolveOutput = (args) => {
    const { outputPath } = args;
    const finalOptions = {
        options: { output: {} },
        outputOptions: {},
    };
    if (outputPath) {
        finalOptions.options.output.path = path.resolve(outputPath);
    }
    return finalOptions;
};

module.exports = resolveOutput;
