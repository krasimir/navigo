export default function flushCurrent(context, done) {
  context.instance._setCurrent(null);

  done();
}