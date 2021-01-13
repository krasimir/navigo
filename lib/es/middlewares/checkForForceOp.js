export default function checkForForceOp(context, done) {
  if (context.navigateOptions.force === true) {
    context.instance._setCurrent([context.instance._pathToMatchObject(context.to)]);

    done(false);
  } else {
    done();
  }
}