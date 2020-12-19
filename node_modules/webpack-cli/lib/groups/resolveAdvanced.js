const { packageExists } = require('../utils/package-exists');
const { promptInstallation } = require('../utils/prompt-installation');
const { yellow } = require('colorette');
const { error, success } = require('../utils/logger');

/**
 * Resolve advanced flags
 * @param {args} args - Parsed args passed to CLI
 */
const resolveAdvanced = async (args) => {
    const { target, prefetch, hot, analyze } = args;

    const finalOptions = {
        options: {},
        outputOptions: {},
    };

    if (hot) {
        const { HotModuleReplacementPlugin } = require('webpack');
        const hotModuleVal = new HotModuleReplacementPlugin();
        if (finalOptions.options && finalOptions.options.plugins) {
            finalOptions.options.plugins.unshift(hotModuleVal);
        } else {
            finalOptions.options.plugins = [hotModuleVal];
        }
    }
    if (prefetch) {
        const { PrefetchPlugin } = require('webpack');
        const prefetchVal = new PrefetchPlugin(null, args.prefetch);
        if (finalOptions.options && finalOptions.options.plugins) {
            finalOptions.options.plugins.unshift(prefetchVal);
        } else {
            finalOptions.options.plugins = [prefetchVal];
        }
    }
    if (analyze) {
        if (packageExists('webpack-bundle-analyzer')) {
            // eslint-disable-next-line node/no-extraneous-require
            const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
            const bundleAnalyzerVal = new BundleAnalyzerPlugin();
            if (finalOptions.options && finalOptions.options.plugins) {
                finalOptions.options.plugins.unshift(bundleAnalyzerVal);
            } else {
                finalOptions.options.plugins = [bundleAnalyzerVal];
            }
        } else {
            await promptInstallation('webpack-bundle-analyzer', () => {
                error(`It looks like ${yellow('webpack-bundle-analyzer')} is not installed.`);
            })
                .then(() => success(`${yellow('webpack-bundle-analyzer')} was installed sucessfully.`))
                .catch(() => {
                    error(`Action Interrupted, Please try once again or install ${yellow('webpack-bundle-analyzer')} manually.`);
                    process.exit(2);
                });
        }
    }
    if (target) {
        finalOptions.options.target = args.target;
    }

    return finalOptions;
};

module.exports = resolveAdvanced;
