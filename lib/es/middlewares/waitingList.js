export default function waitingList(context) {
  context.instance.__dirty = false;

  if (context.instance.__waiting.length > 0) {
    context.instance.__waiting.shift()();
  }
}