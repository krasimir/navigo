import { undefinedOrTrue } from "../utils";
export default function callHandler(context, done) {
  if (undefinedOrTrue(context.navigateOptions, "updateState")) {
    context.instance._setCurrent(context.matches);
  }

  done();
}