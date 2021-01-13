import { getCurrentEnvURL } from "../utils";
export default function _setLocationPath(context, done) {
  if (typeof context.currentLocationPath === "undefined") {
    context.currentLocationPath = getCurrentEnvURL(context.instance.root);
  }

  context.currentLocationPath = context.instance._checkForAHash(context.currentLocationPath);
  done();
}