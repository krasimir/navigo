const { yellow, bold, underline, options } = require('colorette');
const commandLineUsage = require('command-line-usage');

const { core, commands } = require('../utils/cli-flags');
const { hasUnknownArgs, allNames, commands: commandNames } = require('../utils/unknown-args');
const logger = require('../utils/logger');

// This function prints a warning about invalid flag
const printInvalidArgWarning = (args) => {
    const invalidArgs = hasUnknownArgs(args, allNames);
    if (invalidArgs.length > 0) {
        const argType = invalidArgs[0].startsWith('-') ? 'option' : 'command';
        logger.warn(`You provided an invalid ${argType} '${invalidArgs[0]}'.`);
    }
};

// This function is responsible for printing command/flag scoped help
const printSubHelp = (subject, isCommand) => {
    const info = isCommand ? commands : core;
    // Contains object with details about given subject
    const options = info.find((commandOrFlag) => {
        if (isCommand) {
            return commandOrFlag.name == subject || commandOrFlag.alias == subject;
        }
        return commandOrFlag.name === subject.slice(2) || commandOrFlag.alias === subject.slice(1);
    });

    const header = (head) => bold(underline(head));
    const flagAlias = options.alias ? (isCommand ? ` ${options.alias} |` : ` -${options.alias},`) : '';
    const usage = yellow(`webpack${flagAlias} ${options.usage}`);
    const description = options.description;
    const link = options.link;

    logger.raw(`${header('Usage')}: ${usage}`);
    logger.raw(`${header('Description')}: ${description}`);

    if (link) {
        logger.raw(`${header('Documentation')}: ${link}`);
    }

    if (options.flags) {
        const flags = commandLineUsage({
            header: 'Options',
            optionList: options.flags,
        });
        logger.raw(flags);
    }
};

const printHelp = () => {
    const o = (s) => yellow(s);
    const options = require('../utils/cli-flags');
    const negatedFlags = options.core
        .filter((flag) => flag.negative)
        .reduce((allFlags, flag) => {
            return [...allFlags, { name: `no-${flag.name}`, description: `Negates ${flag.name}`, type: Boolean }];
        }, []);
    const title = bold('⬡                     ') + underline('webpack') + bold('                     ⬡');
    const desc = 'The build tool for modern web applications';
    const websitelink = '         ' + underline('https://webpack.js.org');

    const usage = bold('Usage') + ': ' + '`' + o('webpack [...options] | <command>') + '`';
    const examples = bold('Example') + ': ' + '`' + o('webpack help --flag | <command>') + '`';

    const hh = `          ${title}\n
		${websitelink}\n
		${desc}\n
		${usage}\n
		${examples}\n
`;
    return commandLineUsage([
        {
            content: hh,
            raw: true,
        },
        {
            header: 'Available Commands',
            content: options.commands.map((cmd) => {
                return { name: `${cmd.name} | ${cmd.alias}`, summary: cmd.description };
            }),
        },
        {
            header: 'Options',
            optionList: options.core
                .map((e) => {
                    if (e.type.length > 1) e.type = e.type[0];
                    // Here we replace special characters with chalk's escape
                    // syntax (`\$&`) to avoid chalk trying to re-process our input.
                    // This is needed because chalk supports a form of `{var}`
                    // interpolation.
                    e.description = e.description.replace(/[{}\\]/g, '\\$&');
                    return e;
                })
                .concat(negatedFlags),
        },
    ]);
};

const outputHelp = (cliArgs) => {
    options.enabled = !cliArgs.includes('--no-color');
    printInvalidArgWarning(cliArgs);
    const flagOrCommandUsed = allNames.filter((name) => {
        return cliArgs.includes(name);
    })[0];
    const isCommand = commandNames.includes(flagOrCommandUsed);

    // Print full help when no flag or command is supplied with help
    if (flagOrCommandUsed) {
        printSubHelp(flagOrCommandUsed, isCommand);
    } else {
        logger.raw(printHelp());
    }
    logger.raw('\n                  Made with ♥️  by the webpack team');
};

module.exports = outputHelp;
