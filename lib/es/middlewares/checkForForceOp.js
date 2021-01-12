"use strict";

exports.__esModule = true;
exports.default = checkForForceOp;

function checkForForceOp(context, done) {
  if (context.navigateOptions.force === true) {
    context.instance._setCurrent([context.instance._pathToMatchObject(context.to)]);

    done(false);
  } else {
    done();
  }
}

module.exports = exports.default;