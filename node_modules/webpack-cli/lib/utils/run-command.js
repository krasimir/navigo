const execa = require('execa');

async function runCommand(command, args = []) {
    try {
        await execa(command, args, {
            stdio: 'inherit',
            shell: true,
        });
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = {
    runCommand,
};
