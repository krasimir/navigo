const { packageExists } = require('./utils/package-exists');
const webpack = packageExists('webpack') ? require('webpack') : undefined;
const logger = require('./utils/logger');
const webpackMerge = require('webpack-merge');
const { core, coreFlagMap } = require('./utils/cli-flags');
const argParser = require('./utils/arg-parser');
const { outputStrategy } = require('./utils/merge-strategies');
const assignFlagDefaults = require('./utils/flag-defaults');
const { writeFileSync } = require('fs');
const { options: coloretteOptions } = require('colorette');
const WebpackCLIPlugin = require('./plugins/WebpackCLIPlugin');

// CLI arg resolvers
const handleConfigResolution = require('./groups/resolveConfig');
const resolveMode = require('./groups/resolveMode');
const resolveStats = require('./groups/resolveStats');
const resolveOutput = require('./groups/resolveOutput');
const basicResolver = require('./groups/basicResolver');
const resolveAdvanced = require('./groups/resolveAdvanced');
const { toKebabCase } = require('./utils/helpers');

class WebpackCLI {
    constructor() {
        this.compilerConfiguration = {};
        this.outputConfiguration = {};
    }

    /**
     * Responsible for handling flags coming from webpack/webpack
     * @private\
     * @returns {void}
     */
    _handleCoreFlags(parsedArgs) {
        const coreCliHelper = require('webpack').cli;
        if (!coreCliHelper) return;
        const coreConfig = Object.keys(parsedArgs)
            .filter((arg) => {
                return coreFlagMap.has(toKebabCase(arg));
            })
            .reduce((acc, cur) => {
                acc[toKebabCase(cur)] = parsedArgs[cur];
                return acc;
            }, {});
        const coreCliArgs = coreCliHelper.getArguments();
        // Merge the core flag config with the compilerConfiguration
        coreCliHelper.processArguments(coreCliArgs, this.compilerConfiguration, coreConfig);
        // Assign some defaults to core flags
        const configWithDefaults = assignFlagDefaults(this.compilerConfiguration, parsedArgs, this.outputConfiguration);
        this._mergeOptionsToConfiguration(configWithDefaults);
    }

    async _baseResolver(cb, parsedArgs, strategy) {
        const resolvedConfig = await cb(parsedArgs, this.compilerConfiguration);
        this._mergeOptionsToConfiguration(resolvedConfig.options, strategy);
        this._mergeOptionsToOutputConfiguration(resolvedConfig.outputOptions);
    }

    /**
     * Expose commander argParser
     * @param  {...any} args args for argParser
     */
    argParser(...args) {
        return argParser(...args);
    }

    getCoreFlags() {
        return core;
    }

    /**
     * Responsible to override webpack options.
     * @param {Object} options The options returned by a group helper
     * @param {Object} strategy The strategy to pass to webpack-merge. The strategy
     * is implemented inside the group helper
     * @private
     * @returns {void}
     */
    _mergeOptionsToConfiguration(options, strategy) {
        /**
         * options where they differ per config use this method to apply relevant option to relevant config
         * eg mode flag applies per config
         */
        if (Array.isArray(options) && Array.isArray(this.compilerConfiguration)) {
            this.compilerConfiguration = options.map((option, index) => {
                const compilerConfig = this.compilerConfiguration[index];
                if (strategy) {
                    return webpackMerge.strategy(strategy)(compilerConfig, option);
                }
                return webpackMerge(compilerConfig, option);
            });
            return;
        }

        /**
         * options is an array (multiple configuration) so we create a new
         * configuration where each element is individually merged
         */
        if (Array.isArray(options)) {
            this.compilerConfiguration = options.map((configuration) => {
                if (strategy) {
                    return webpackMerge.strategy(strategy)(this.compilerConfiguration, configuration);
                }
                return webpackMerge(this.compilerConfiguration, configuration);
            });
        } else {
            /**
             * The compiler configuration is already an array, so for each element
             * we merge the options
             */
            if (Array.isArray(this.compilerConfiguration)) {
                this.compilerConfiguration = this.compilerConfiguration.map((thisConfiguration) => {
                    if (strategy) {
                        return webpackMerge.strategy(strategy)(thisConfiguration, options);
                    }
                    return webpackMerge(thisConfiguration, options);
                });
            } else {
                if (strategy) {
                    this.compilerConfiguration = webpackMerge.strategy(strategy)(this.compilerConfiguration, options);
                } else {
                    this.compilerConfiguration = webpackMerge(this.compilerConfiguration, options);
                }
            }
        }
    }

    /**
     * Responsible for creating and updating the new  output configuration
     *
     * @param {Object} options Output options emitted by the group helper
     * @private
     * @returns {void}
     */
    _mergeOptionsToOutputConfiguration(options) {
        if (options) {
            this.outputConfiguration = Object.assign(this.outputConfiguration, options);
        }
    }

    /**
     * It runs in a fancy order all the expected groups.
     * Zero config and configuration goes first.
     *
     * The next groups will override existing parameters
     * @returns {Promise<void>} A Promise
     */
    async runOptionGroups(parsedArgs) {
        await Promise.resolve()
            .then(() => this._baseResolver(handleConfigResolution, parsedArgs))
            .then(() => this._baseResolver(resolveMode, parsedArgs))
            .then(() => this._baseResolver(resolveOutput, parsedArgs, outputStrategy))
            .then(() => this._handleCoreFlags(parsedArgs))
            .then(() => this._baseResolver(basicResolver, parsedArgs))
            .then(() => this._baseResolver(resolveAdvanced, parsedArgs))
            .then(() => this._baseResolver(resolveStats, parsedArgs));
    }

    handleError(error) {
        // https://github.com/webpack/webpack/blob/master/lib/index.js#L267
        // https://github.com/webpack/webpack/blob/v4.44.2/lib/webpack.js#L90
        const ValidationError = webpack.ValidationError || webpack.WebpackOptionsValidationError;

        // In case of schema errors print and exit process
        // For webpack@4 and webpack@5
        if (error instanceof ValidationError) {
            logger.error(error.message);
        } else {
            logger.error(error);
        }
    }

    createCompiler(options, callback) {
        let compiler;

        try {
            compiler = webpack(options, callback);
        } catch (error) {
            this.handleError(error);
            process.exit(2);
        }

        return compiler;
    }

    async getCompiler(args) {
        await this.runOptionGroups(args);
        return this.createCompiler(this.compilerConfiguration);
    }

    async run(args) {
        await this.runOptionGroups(args);

        let compiler;

        let options = this.compilerConfiguration;
        let outputOptions = this.outputConfiguration;

        const isRawOutput = typeof outputOptions.json === 'undefined';

        if (isRawOutput) {
            const webpackCLIPlugin = new WebpackCLIPlugin({
                progress: outputOptions.progress,
            });

            const addPlugin = (options) => {
                if (!options.plugins) {
                    options.plugins = [];
                }
                options.plugins.unshift(webpackCLIPlugin);
            };
            if (Array.isArray(options)) {
                options.forEach(addPlugin);
            } else {
                addPlugin(options);
            }
        }

        const callback = (error, stats) => {
            if (error) {
                this.handleError(error);
                process.exit(2);
            }

            if (stats.hasErrors()) {
                process.exitCode = 1;
            }

            const getStatsOptions = (stats) => {
                // TODO remove after drop webpack@4
                if (webpack.Stats && webpack.Stats.presetToOptions) {
                    if (!stats) {
                        stats = {};
                    } else if (typeof stats === 'boolean' || typeof stats === 'string') {
                        stats = webpack.Stats.presetToOptions(stats);
                    }
                }

                stats.colors = typeof stats.colors !== 'undefined' ? stats.colors : coloretteOptions.enabled;

                return stats;
            };

            const getStatsOptionsFromCompiler = (compiler) => getStatsOptions(compiler.options ? compiler.options.stats : undefined);

            const foundStats = compiler.compilers
                ? { children: compiler.compilers.map(getStatsOptionsFromCompiler) }
                : getStatsOptionsFromCompiler(compiler);

            if (outputOptions.json === true) {
                process.stdout.write(JSON.stringify(stats.toJson(foundStats), null, 2) + '\n');
            } else if (typeof outputOptions.json === 'string') {
                const JSONStats = JSON.stringify(stats.toJson(foundStats), null, 2);

                try {
                    writeFileSync(outputOptions.json, JSONStats);

                    logger.success(`stats are successfully stored as json to ${outputOptions.json}`);
                } catch (error) {
                    logger.error(error);

                    process.exit(2);
                }
            } else {
                logger.raw(`${stats.toString(foundStats)}`);
            }
        };

        compiler = this.createCompiler(options, callback);

        if (compiler && outputOptions.interactive) {
            const interactive = require('./utils/interactive');

            interactive(compiler, options, outputOptions);
        }

        return Promise.resolve();
    }
}

module.exports = WebpackCLI;
