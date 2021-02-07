import { QContext } from "../../index";

export default function waitingList(context: QContext) {
  context.instance.__dirty = false;
  if (context.instance.__waiting.length > 0) {
    context.instance.__waiting.shift()();
  }
}
