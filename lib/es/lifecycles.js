import Q from "./Q";
import checkForLeaveHook from "./middlewares/checkForLeaveHook";
import checkForBeforeHook from "./middlewares/checkForBeforeHook";
import callHandler from "./middlewares/callHandler";
import checkForAfterHook from "./middlewares/checkForAfterHook";
import checkForAlreadyHook from "./middlewares/checkForAlreadyHook";
import checkForNotFoundHandler from "./middlewares/checkForNotFoundHandler";
import errorOut from "./middlewares/errorOut";
import flushCurrent from "./middlewares/flushCurrent";
export var foundLifecycle = [checkForAlreadyHook, checkForLeaveHook, checkForBeforeHook, callHandler, checkForAfterHook];
export var notFoundLifeCycle = [checkForNotFoundHandler, Q["if"](function (_ref) {
  var notFoundHandled = _ref.notFoundHandled;
  return notFoundHandled;
}, foundLifecycle, [errorOut, checkForLeaveHook]), flushCurrent];