import { QContext } from "../../index";
import { getCurrentEnvURL } from "../utils";

export default function setLocationPath(context: QContext, done: () => void): void {
  
  const { currentLocationPath, instance } = context;
  
  if (typeof currentLocationPath === "undefined") {
    context.currentLocationPath = context.to = getCurrentURLPath(instance.root);
  }
  
  context.currentLocationPath = instance._checkForAHash(currentLocationPath);
  
  done();
}
