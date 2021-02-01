import { QContext } from "../../index";
import { undefinedOrTrue } from "../utils";

export default function updateState(context: QContext, done) {
  if (undefinedOrTrue(context.navigateOptions, "updateState")) {
    context.instance._setCurrent(context.matches);
  }
  done();
}
