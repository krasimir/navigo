"use strict";

exports.__esModule = true;
exports.default = flushCurrent;

function flushCurrent(context, done) {
  context.instance._setCurrent(null);

  done();
}

module.exports = exports.default;