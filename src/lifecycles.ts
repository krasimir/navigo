import { QContext } from "../index";
import Q from "./Q";
import checkForLeaveHook from "./middlewares/checkForLeaveHook";
import checkForBeforeHook from "./middlewares/checkForBeforeHook";
import callHandler from "./middlewares/callHandler";
import checkForAfterHook from "./middlewares/checkForAfterHook";
import checkForAlreadyHook from "./middlewares/checkForAlreadyHook";
import checkForNotFoundHandler from "./middlewares/checkForNotFoundHandler";
import errorOut from "./middlewares/errorOut";
import flushCurrent from "./middlewares/flushCurrent";

export const foundLifecycle = [
  checkForAlreadyHook,
  checkForLeaveHook,
  checkForBeforeHook,
  callHandler,
  checkForAfterHook,
];

export const notFoundLifeCycle = [
  checkForNotFoundHandler,
  Q.if(({ notFoundHandled }: QContext) => notFoundHandled, foundLifecycle, [
    errorOut,
    checkForLeaveHook,
  ]),
  flushCurrent,
];
