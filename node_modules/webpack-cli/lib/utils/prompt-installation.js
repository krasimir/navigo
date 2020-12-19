const { prompt } = require('enquirer');
const { green } = require('colorette');
const { runCommand } = require('./run-command');
const getPackageManager = require('./get-package-manager');
const { packageExists } = require('./package-exists');

/**
 *
 * @param packageName
 * @param preMessage Message to show before the question
 */
async function promptInstallation(packageName, preMessage) {
    const packageManager = getPackageManager();
    const options = [packageManager === 'yarn' ? 'add' : 'install', '-D', packageName];

    const commandToBeRun = `${packageManager} ${options.join(' ')}`;
    if (preMessage) {
        preMessage();
    }
    const question = `Would you like to install ${packageName}? (That will run ${green(commandToBeRun)})`;
    const { installConfirm } = await prompt([
        {
            type: 'confirm',
            name: 'installConfirm',
            message: question,
            initial: 'Y',
        },
    ]);
    if (installConfirm) {
        await runCommand(commandToBeRun);
        return packageExists(packageName);
    }

    process.exitCode = 2;
}

module.exports = {
    promptInstallation,
};
