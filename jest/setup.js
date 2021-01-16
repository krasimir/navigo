const { CustomConsole } = require("@jest/console");

global.console = new CustomConsole(
  process.stdout,
  process.stderr,
  simpleFormatter
);

function simpleFormatter(type, message) {
  return message
    .split(/\n/)
    .map((line) => "  " + line)
    .join("\n");
}
