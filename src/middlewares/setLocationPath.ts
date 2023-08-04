import { QContext } from "../../index";
import { getCurrentEnvURL } from "../utils";

export default function setLocationPath(context: QContext, done) {
  if (typeof context.currentLocationPath === "undefined") {
    context.currentLocationPath = context.to = getCurrentEnvURL(
      context.instance.root
    );
  }
  context.currentLocationPath = context.instance._checkForAHash(
    context.currentLocationPath
  );
  done();
}
