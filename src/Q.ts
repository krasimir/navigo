type QChild = {
  type: "child";
  funcs: Array<Function | Array<any> | QChild>;
};

export default function Q(
  funcs: Array<Function | Array<any> | QChild>,
  c?: any
) {
  const context = c || {};
  let idx = 0;

  (function next() {
    if (!funcs[idx]) return;
    if (Array.isArray(funcs[idx])) {
      funcs.splice(
        idx,
        1,
        ...(funcs[idx][0](context) ? funcs[idx][1] : funcs[idx][2])
      );
      next();
    } else if ((funcs[idx] as QChild).type === "child") {
      funcs.splice(idx, 1, ...(funcs[idx] as QChild).funcs);
      next();
    } else {
      // console.log(funcs[idx].name + " / " + JSON.stringify(context));
      (funcs[idx] as Function)(context, (moveForward) => {
        if (typeof moveForward === "undefined" || moveForward === true) {
          idx += 1;
          next();
        }
      });
    }
  })();
}

Q.if = function (condition: Function, one, two) {
  if (!Array.isArray(one)) one = [one];
  if (!Array.isArray(two)) two = [two];
  return [condition, one, two];
};

Q.child = function (funcs): QChild {
  return { type: "child", funcs };
};
