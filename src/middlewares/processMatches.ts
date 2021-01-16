import { QContext } from "../../index";
import Q from "../Q";
import { foundLifecycle } from "../lifecycles";
import updateState from "./updateState";
import checkForLeaveHook from "./checkForLeaveHook";

export default function processMatches(context: QContext, done) {
  let idx = 0;
  function nextMatch() {
    if (idx === context.matches.length) {
      updateState(context, done);
      return;
    }
    Q(
      foundLifecycle,
      { ...context, match: context.matches[idx] },
      function end() {
        idx += 1;
        nextMatch();
      }
    );
  }
  checkForLeaveHook(context, nextMatch);
}
