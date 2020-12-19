const PRODUCTION = 'production';
const DEVELOPMENT = 'development';

/*
Mode priority:
    - Mode flag
    - Mode from config
    - Mode form NODE_ENV
*/

/**
 *
 * @param {string} mode - mode flag value
 * @param {Object} configObject - contains relevant loaded config
 */
const assignMode = (mode, configObject) => {
    const {
        env: { NODE_ENV },
    } = process;
    const { mode: configMode } = configObject;
    let finalMode;
    if (mode) {
        finalMode = mode;
    } else if (configMode) {
        finalMode = configMode;
    } else if (NODE_ENV && (NODE_ENV === PRODUCTION || NODE_ENV === DEVELOPMENT)) {
        finalMode = NODE_ENV;
    } else {
        finalMode = PRODUCTION;
    }
    return { mode: finalMode };
};

/**
 *
 * @param {Object} args - parsedArgs from the CLI
 * @param {Object | Array} configOptions - Contains loaded config or array of configs
 */
const resolveMode = (args, configOptions) => {
    const { mode } = args;
    let resolvedMode;
    if (Array.isArray(configOptions)) {
        resolvedMode = configOptions.map((configObject) => assignMode(mode, configObject));
    } else resolvedMode = assignMode(mode, configOptions);

    return { options: resolvedMode };
};

module.exports = resolveMode;
