import { getCurrentEnvURL } from "../utils";
export default function setLocationPath(context, done) {
  if (typeof context.currentLocationPath === "undefined") {
    context.currentLocationPath = context.to = getCurrentEnvURL(context.instance.root);
  }

  context.currentLocationPath = context.instance._checkForAHash(context.currentLocationPath);
  done();
}