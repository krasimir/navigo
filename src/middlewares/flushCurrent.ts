import { QContext } from "../../index";

export default function flushCurrent(context: QContext, done) {
  context.instance._setCurrent(null);
  done();
}
