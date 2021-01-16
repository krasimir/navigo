function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import Q from "../Q";
import { foundLifecycle } from "../lifecycles";
import updateState from "./updateState";
import checkForLeaveHook from "./checkForLeaveHook";
export default function processMatches(context, done) {
  var idx = 0;

  function nextMatch() {
    if (idx === context.matches.length) {
      updateState(context, done);
      return;
    }

    Q(foundLifecycle, _extends({}, context, {
      match: context.matches[idx]
    }), function end() {
      idx += 1;
      nextMatch();
    });
  }

  checkForLeaveHook(context, nextMatch);
}