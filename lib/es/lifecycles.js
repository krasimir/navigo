import Q from "./Q";
import checkForLeaveHook from "./middlewares/checkForLeaveHook";
import checkForBeforeHook from "./middlewares/checkForBeforeHook";
import callHandler from "./middlewares/callHandler";
import checkForAfterHook from "./middlewares/checkForAfterHook";
import checkForAlreadyHook from "./middlewares/checkForAlreadyHook";
import checkForNotFoundHandler from "./middlewares/checkForNotFoundHandler";
import errorOut from "./middlewares/errorOut";
import flushCurrent from "./middlewares/flushCurrent";
import updateState from "./middlewares/updateState";
export var foundLifecycle = [checkForAlreadyHook, checkForBeforeHook, callHandler, checkForAfterHook];
export var notFoundLifeCycle = [checkForLeaveHook, checkForNotFoundHandler, Q["if"](function (_ref) {
  var notFoundHandled = _ref.notFoundHandled;
  return notFoundHandled;
}, foundLifecycle.concat([updateState]), [errorOut, flushCurrent])];