/***
const { gray, bold, white, cyan, yellow } = require('colorette');
const ansiEscapes = require('ansi-escapes');
const readline = require('readline');

let isSub = false;
const generateSingleOption = (option) => {
    const { key, description } = option;
    const optionString = gray('> Press') + ` ${bold(white(key))} ` + gray(`${description}\n`);
    return optionString;
};
const generateConfigDescription = (config) => {
    let configDescString = '\n';
    const headerString = bold(white('Interactive Usage'));
    configDescString += headerString;
    configDescString += '\n';
    Object.keys(config).forEach((option) => {
        configDescString += generateSingleOption(config[option]);
    });
    configDescString += '\n';
    return configDescString;
};

const setupInteractive = () => {
    const usagePrompt = generateConfigDescription(interactiveConfig);
    console.clear();
    console.log(usagePrompt);
};

const informActions = () => {
    console.log('You can now analyze your build, press c to continue...\n');
};

const writeFilterConsole = () => {
    if (state.length) {
        const latestCompilation = state[state.length - 1];
        const data = [];

        for (let i = 0; i < latestCompilation.chunks.length; i++) {
            const name = latestCompilation.chunks[i].id;
            const chunksArr = [];
            for (let j = 0; j < latestCompilation.chunks[i].modules.length; j++) {
                const size = latestCompilation.chunks[i].modules[j].size;
                const path = latestCompilation.chunks[i].modules[j].name.replace('./', '');
                const issuerPath = latestCompilation.chunks[i].modules[j].issuerPath;
                chunksArr.push({ path, size, issuerPath });
            }
            data.push({ [name]: chunksArr });
        }
        console.clear();
        data.forEach((chunk) => {
            Object.keys(chunk).forEach((mod) => {
                console.log(bold(cyan(mod)));
                chunk[mod].forEach((sub) => {
                    console.log('> ', yellow(sub.path));
                });
            });
        });
        process.stdout.write(ansiEscapes.cursorTo(0, 1));
    }
};

const state = [];
const interactiveConfig = [
    {
        key: 'a',
        description: 'Analyze build for performance improvements',
        onShowMore: [],
    },
    {
        key: 'p',
        description: 'Pause compilation at a given time',
        onShowMore: [],
    },
    {
        key: 'm',
        description: 'Filter a module and get stats on why a module was included',
        onShowMore: [],
    },
    {
        key: 'Enter',
        description: 'Run webpack',
        onShowMore: [],
    },
    {
        key: 'q',
        description: 'Exit interactive mode',
        onShowMore: [],
    },
];

const EXIT_KEY = 'q';
const ANALYZE_KEY = 'a';
const FILTER_KEY = 'm';
const ENTER_KEY = '\n';
const B_KEY = 'b';
const C_KEY = 'c';

module.exports = async function (compiler, config, outputOptions) {
    const stdin = process.stdin;
    stdin.setEncoding('utf-8');
    stdin.setRawMode(true);
    readline.emitKeypressEvents(stdin);

    outputOptions.interactive = false;

    state.push(compiler);

    setupInteractive();

    const isExitCtrl = (key) => key.ctrl && key.name === 'c';

    stdin.on('keypress', (str, key) => {
        stdin.setRawMode(true);
        if (isExitCtrl(key)) {
            console.clear();
            process.exit();
        }
        switch (key.name) {
            case 'down':
                process.stdout.write(ansiEscapes.cursorNextLine);
                break;
            case 'up':
                process.stdout.write(ansiEscapes.cursorPrevLine);
                break;
            case 'return':
                // TODO: get line and do stuff
                break;
            default:
                break;
        }
    });

    stdin.on('data', async function (data) {
        if (isSub === true) {
            console.log(data, 'yo');
            return;
        }
        switch (data) {
            case C_KEY:
                setupInteractive();
                break;
            case EXIT_KEY:
                console.log('exit');
                process.exit(0);
            case ANALYZE_KEY:
                console.log('analyzing modules');
                break;
            case FILTER_KEY:
                isSub = true;
                writeFilterConsole();
                break;
            case B_KEY:
                console.clear();
                stdin.setEncoding('utf-8');
                setupInteractive();
                break;
            case ENTER_KEY: {
                console.clear();
                console.log('Running webpack');
                if (state.length) {
                    state.pop();
                }
                state.push(compiler);
                informActions();
                isSub = true;
                return;
            }
            default:
                break;
        }
    });
};
*
***/
