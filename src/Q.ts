type QChild =
  | { type: "child"; funcs: Array<QFunc> }
  | ((context: any, next: () => void) => void);

type QFunc = Function | Array<any> | QChild;

type QOptions = {
    context?: any;
    done?: Function;
};

  export default function Q(funcs: Array<QFunc>, options: QOptions) {
    const context = options.context || {};
    const done = options.done;
    let idx = 0;
  
    (function next() {
    const currentFunc = funcs[idx];
      if (!currentFunc) {
        if (done) {
          done(context);
        }
        return;
      }
      if (Array.isArray(currentFunc)) {
        const [conditionFn, truthyFuncs, falsyFuncs] = currentFunc;
        funcs.splice(
          idx,
          1,
          ...(conditionFn(context) ? truthyFuncs : falsyFuncs)
        );
        next();
      } else {
        // console.log(funcs[idx].name + " / " + JSON.stringify(context));
        // console.log(funcs[idx].name);
        // console.log(currentFunc.name + " / " + JSON.stringify(context));
        // console.log(currentFunc.name);        
        (currentFunc as Function)(context, (moveForward) => {
          if (typeof moveForward === "undefined" || moveForward === true) {
            idx += 1;
            next();
          } else if (done) {
            done(context);
          }
        });
      }
    })();
  }
  
Q.if = function (condition: Function, truthyFuncs, falsyFuncs) {
    if (!Array.isArray(truthyFuncs)) truthyFuncs = [truthyFuncs];
    if (!Array.isArray(falsyFuncs)) falsyFuncs = [falsyFuncs];
    return [condition, truthyFuncs, falsyFuncs];
};
