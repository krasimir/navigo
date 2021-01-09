import { QContext } from "../../index";
import Q from "../Q";
import { foundLifecycle } from "../lifecycles";

export default function processMatches(context: QContext, done) {
  let idx = 0;
  // console.log(
  //   "_processMatches matches=" +
  //     (context.matches ? context.matches.length : 0)
  // );
  (function nextMatch() {
    if (idx === context.matches.length) {
      done();
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
  })();
}
