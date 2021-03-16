import { QContext } from "../../index";

export default function waitingList(context: QContext) {
  context.instance.__markAsClean(context);
}
