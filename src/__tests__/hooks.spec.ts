import NavigoRouter from "../../index";
import Navigo from "../index";

describe("Given the Navigo library", () => {
  beforeEach(() => {
    history.pushState({}, "", "/");
  });
  describe("when we set hooks as part of the route map", () => {
    it("should keep the hooks working", () => {
      const r: NavigoRouter = new Navigo("/");
      const handler = jest.fn();
      const beforeHook = jest.fn().mockImplementation((done) => done());

      r.on({
        "/foo/:id": {
          as: "some.name",
          uses: handler,
          hooks: {
            before: beforeHook,
          },
        },
      });

      r.resolve("/foo/100");

      expect(handler).toBeCalledTimes(1);
      expect(beforeHook).toBeCalledTimes(1);
    });
  });
  describe("when using the `before` hook", () => {
    it("should call the hook before resolving a handler", () => {
      const r: NavigoRouter = new Navigo("/");
      const order = [];
      const h1 = jest.fn().mockImplementation(() => order.push(1));
      const h2 = jest.fn().mockImplementation(() => order.push(2));
      const expectedMatch = {
        data: { id: "100" },
        params: { a: "b" },
        queryString: "a=b",
        hashString: "",
        route: expect.any(Object),
        url: "foo/100",
      };

      r.on("/foo/:id", h1, {
        before(done, match) {
          h2(match);
          done();
        },
      });

      r.resolve("/foo/100?a=b");

      expect(h2).toBeCalledWith(expectedMatch);
      expect(h1).toBeCalledWith(expectedMatch);
      expect(order).toStrictEqual([2, 1]);
    });
    it("should allow us to block the handler", () => {
      const r: NavigoRouter = new Navigo("/");
      const h1 = jest.fn();
      const h2 = jest.fn();

      r.on("/foo", h1, {
        before(done) {
          h2();
          done(false);
        },
      });

      r.resolve("/foo");

      expect(h2).toBeCalledTimes(1);
      expect(h1).not.toBeCalled();
    });
    it("should not fire the hook if callHooks is equal to `false`", () => {
      const r: NavigoRouter = new Navigo("/");
      const h1 = jest.fn();
      const h2 = jest.fn().mockImplementation((done) => done());

      r.on("/foo/:id", h1, {
        before: h2,
      });

      r.navigate("/foo/100", { callHooks: false });

      expect(h1).toBeCalledTimes(1);
      expect(h2).not.toBeCalled();
    });
  });
  describe("when using the `after` hook", () => {
    it("should fire the hook when the handler is resolved", () => {
      const r: NavigoRouter = new Navigo("/");
      const order = [];
      const h1 = jest.fn().mockImplementation(() => order.push(1));
      const h2 = jest.fn().mockImplementation(() => order.push(2));
      const expectedMatch = {
        data: { id: "100" },
        params: { a: "b" },
        queryString: "a=b",
        hashString: "",
        route: expect.any(Object),
        url: "foo/100",
      };

      r.on("/foo/:id", h1, {
        after(match) {
          h2(match);
        },
      });

      r.resolve("/foo/100?a=b");

      expect(h2).toBeCalledWith(expectedMatch);
      expect(h1).toBeCalledWith(expectedMatch);
      expect(order).toStrictEqual([1, 2]);
    });
    it("should not fire the hook if callHooks is equal to `false`", () => {
      const r: NavigoRouter = new Navigo("/");
      const h1 = jest.fn();
      const h2 = jest.fn();

      r.on("/foo/:id", h1, {
        after: h2,
      });

      r.navigate("/foo/100", { callHooks: false });

      expect(h1).toBeCalledTimes(1);
      expect(h2).not.toBeCalled();
    });
  });
  describe("when using the `leave` hook", () => {
    it("should fire the hook when we leave out of a route", () => {
      const r: NavigoRouter = new Navigo("/");
      const order = [];
      const h1 = jest.fn().mockImplementation(() => order.push(1));
      const h2 = jest.fn().mockImplementation(() => order.push(2));
      const h3 = jest.fn().mockImplementation(() => order.push(3));

      r.on("/foo/:id", h2)
        .on("/", h1, {
          leave(done, match) {
            h3(match);
            done();
          },
        })
        .resolve();

      r.resolve("/foo/100?a=b");

      expect(h1).toBeCalledWith(expect.objectContaining({ url: "" }));
      expect(h2).toBeCalledWith({
        data: { id: "100" },
        params: { a: "b" },
        queryString: "a=b",
        hashString: "",
        route: expect.any(Object),
        url: "foo/100",
      });
      expect(h3).toBeCalledWith({
        data: { id: "100" },
        params: { a: "b" },
        queryString: "a=b",
        hashString: "",
        route: expect.any(Object),
        url: "foo/100",
      });
      expect(order).toStrictEqual([1, 3, 2]);
    });
    it("should allow us to block the leaving", () => {
      const r: NavigoRouter = new Navigo("/");
      const spy1 = jest.fn();
      const spy2 = jest.fn();

      r.on("/nope", spy1, { leave: (done) => done(false) });
      r.on("/foo", spy2);
      r.on("/bar", spy2);
      r.on(spy2);
      r.navigate("/foo");
      r.navigate("/nope");
      r.navigate("/bar");
      r.navigate("/foo");
      r.navigate("/");

      expect(spy1).toBeCalledTimes(1);
      expect(spy1).toBeCalledWith(
        expect.objectContaining({
          url: "nope",
        })
      );
      expect(spy2).toBeCalledTimes(1);
      expect(spy2).toBeCalledWith(
        expect.objectContaining({
          url: "foo",
        })
      );
    });
    it("should not call pushState (or replaceState) if the leaving is blocked", () => {
      const pushState = jest.spyOn(window.history, "pushState");
      const r: NavigoRouter = new Navigo("/");
      const spy = jest.fn();

      r.on("/nope", spy, { leave: (done) => done(false) });
      r.on("/foo", spy);
      r.on("/bar", spy);
      r.on(spy);
      r.navigate("/nope");
      r.navigate("/bar");
      r.navigate("/foo");
      r.navigate("/");

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          url: "nope",
        })
      );
      expect(pushState).toBeCalledTimes(1);
      expect(pushState).toBeCalledWith({}, "", "/nope");
      pushState.mockRestore();
    });
    describe("and we have matched routes after which we have no-matching url", () => {
      it("should call the leave hook of the last matched one", () => {
        const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
        const r: NavigoRouter = new Navigo("/");
        const leaveHook = jest.fn().mockImplementation((done) => done());
        r.on("/foo", () => {}, { leave: leaveHook });
        r.navigate("/foo");
        r.navigate("/bar");
        expect(leaveHook).toBeCalledTimes(1);
        expect(leaveHook).toBeCalledWith(expect.any(Function), undefined);
        warn.mockRestore();
      });
    });
    describe("and we have already matched route with ? symbol", () => {
      it("should not call the leave hook of the already matched route", () => {
        const r: NavigoRouter = new Navigo("/", { strategy: "ALL" });
        const handlerA = jest.fn();
        const AHooks = {
          leave: jest.fn().mockImplementation((done) => done()),
        };
        const handlerB = jest.fn();
        const BHooks = {
          leave: jest.fn().mockImplementation((done) => done()),
        };

        r.on("/foo/:id/save", handlerB, BHooks);
        r.on("/foo/:id/?", handlerA, AHooks);

        r.navigate("/foo/20");
        r.navigate("/foo/20/save");

        expect(handlerA).toBeCalledTimes(2);
        expect(handlerB).toBeCalledTimes(1);
        expect(AHooks.leave).not.toBeCalled();
        expect(BHooks.leave).not.toBeCalled();
      });
    });
    describe("and we have two routes with the same paths", () => {
      it("should not call the leave hook on the first one", () => {
        history.pushState({}, "", "/foo/bar");
        const r: NavigoRouter = new Navigo("/", { strategy: "ALL" });
        const handlerA = jest.fn();
        const AHooks = {
          leave: jest.fn().mockImplementation((done) => done()),
        };
        const handlerB = jest.fn();
        const BHooks = {
          leave: jest.fn().mockImplementation((done) => done()),
        };

        r.on("/foo/:id", handlerA, AHooks);
        r.resolve(undefined, { noMatchWarning: true });
        r.on("/foo/:id", handlerB, BHooks);
        r.resolve(undefined, { noMatchWarning: true });

        expect(handlerA).toBeCalledTimes(1);
        expect(handlerB).toBeCalledTimes(1);
        expect(AHooks.leave).not.toBeCalled();
        expect(BHooks.leave).not.toBeCalled();
      });
    });
    it("should not fire the hook if callHooks is equal to `false`", () => {
      const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
      const r: NavigoRouter = new Navigo("/");
      const h1 = jest.fn();
      const h2 = jest.fn();

      r.on("/foo/:id", h1, {
        leave: h2,
      });

      r.navigate("/foo/100?a=b");
      r.navigate("bar", { callHooks: false });

      expect(h1).toBeCalledTimes(1);
      expect(h2).not.toBeCalled();
      warn.mockRestore();
    });
    it("should call the hook for the `*` path", () => {
      history.pushState({}, "", "/foo");
      const r: NavigoRouter = new Navigo("/");
      const hook1 = jest.fn().mockImplementation((done) => done());
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      r.on("/foo", handler2);
      r.on("*", handler1, { leave: hook1 });

      r.resolve();
      r.navigate("/nope");
      r.navigate("/foo");

      expect(handler2).toBeCalledTimes(2);
      expect(handler1).toBeCalledTimes(1);
      expect(hook1).toBeCalledTimes(1);
      expect(hook1).toBeCalledWith(
        expect.any(Function),
        expect.objectContaining({ url: "foo" })
      );
    });
  });
  describe("when using the `already` hook", () => {
    it("should fire the hook when we are matching the same handler", () => {
      const r: NavigoRouter = new Navigo("/");
      const order = [];
      const h1 = jest.fn().mockImplementation(() => order.push(1));
      const h2 = jest.fn().mockImplementation(() => order.push(2));
      const expectedMatch = {
        data: { id: "100" },
        params: { a: "b" },
        queryString: "a=b",
        hashString: "",
        route: expect.any(Object),
        url: "foo/100",
      };

      r.on("/foo/:id", h1, {
        already(match) {
          h2(match);
        },
      });

      r.resolve("/foo/100?a=b");
      r.resolve("/foo/100?a=b");

      expect(h2).toBeCalledWith(expectedMatch);
      expect(h1).toBeCalledWith(expectedMatch);
      expect(order).toStrictEqual([1, 2]);
    });
    it("should not fire the hook if callHooks is equal to `false`", () => {
      const r: NavigoRouter = new Navigo("/");
      const h1 = jest.fn();
      const h2 = jest.fn();

      r.on("/foo/:id", h1, {
        already: h2,
      });

      r.navigate("/foo/100?a=b");
      r.navigate("/foo/100?a=b", { callHooks: false });

      expect(h1).toBeCalledTimes(1);
      expect(h2).not.toBeCalled();
    });
  });
  describe("when passing hooks to the default handler", () => {
    it("should use the hooks", () => {
      const r: NavigoRouter = new Navigo("/");
      const order = [];
      const h1 = jest.fn().mockImplementation(() => order.push(1));
      const h2 = jest.fn().mockImplementation(() => order.push(2));
      const h3 = jest.fn().mockImplementation(() => order.push(3));
      const expectedMatch = {
        data: null,
        params: null,
        queryString: "",
        hashString: "",
        route: expect.any(Object),
        url: "",
      };

      r.on(h1, {
        before(done, match) {
          h2(match);
          done();
        },
        after(match) {
          h3(match);
        },
      });

      r.resolve("/");

      expect(h1).toBeCalledWith(expectedMatch);
      expect(h2).toBeCalledWith(expectedMatch);
      expect(h3).toBeCalledWith(expectedMatch);
      expect(order).toStrictEqual([2, 1, 3]);
    });
  });
  describe("when passing hooks to the not found handler", () => {
    it("should use the hooks", () => {
      const r: NavigoRouter = new Navigo("/");
      const order = [];
      const h1 = jest.fn().mockImplementation(() => order.push(1));
      const h2 = jest.fn().mockImplementation(() => order.push(2));
      const h3 = jest.fn().mockImplementation(() => order.push(3));
      const expectedMatch = {
        data: null,
        params: null,
        queryString: "",
        hashString: "",
        route: expect.any(Object),
        url: "wat",
      };

      r.notFound(h1, {
        before(done, match) {
          h2(match);
          done();
        },
        after(match) {
          h3(match);
        },
      });

      r.resolve("/wat");
      expect(h1).toBeCalledWith(expectedMatch);
      expect(h2).toBeCalledWith(expectedMatch);
      expect(h3).toBeCalledWith(expectedMatch);
      expect(order).toStrictEqual([2, 1, 3]);
    });
  });
  describe("when using generic hooks", () => {
    it("should set the generic hooks to every registered route", () => {
      const r: NavigoRouter = new Navigo("/");
      const hooks = {
        before: jest.fn().mockImplementation((done) => {
          done();
        }),
        after: jest.fn(),
      };
      const h1 = jest.fn();
      const h2 = jest.fn();
      const h3 = jest.fn();

      r.hooks(hooks);

      r.notFound(h3);
      r.on("/foo/bar", h1);
      r.on("/", h2);

      r.resolve("/foo/bar");
      r.resolve("/");
      r.resolve("/noo");

      expect(hooks.before).toBeCalledTimes(3);
      expect(hooks.after).toBeCalledTimes(3);
      expect(h1).toBeCalledTimes(1);
      expect(h2).toBeCalledTimes(1);
      expect(h3).toBeCalledTimes(1);
    });
    describe("and we have a route specific hooks", () => {
      it("should call both", () => {
        const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
        const whatHappened = [];
        const r: NavigoRouter = new Navigo("/");
        const createHooks = (prefix) => ({
          before(done, match) {
            whatHappened.push(prefix + "before");
            done();
          },
          after() {
            whatHappened.push(prefix + "after");
          },
          already() {
            whatHappened.push(prefix + "already");
          },
          leave(done) {
            whatHappened.push(prefix + "leave");
            done();
          },
        });

        r.hooks(createHooks("generic_"));

        r.on("/foo/bar", jest.fn(), createHooks("route_"));

        r.navigate("/foo/bar");
        r.navigate("/foo/bar");
        r.navigate("/boo");

        expect(whatHappened).toStrictEqual([
          "generic_before",
          "route_before",
          "generic_after",
          "route_after",
          "generic_already",
          "route_already",
          "generic_leave",
          "route_leave",
        ]);

        warn.mockRestore();
      });
    });
  });
  describe("when adding hooks to already existing routes", () => {
    it("should register the hook and call it as part of the route resolving", (done) => {
      const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
      const whatHappened = [];
      const r: NavigoRouter = new Navigo("/");
      const createHooks = (prefix) => ({
        before(done, match) {
          setTimeout(() => {
            whatHappened.push(prefix + "before");
            done();
          }, 20);
        },
        after() {
          whatHappened.push(prefix + "after");
        },
        already() {
          whatHappened.push(prefix + "already");
        },
        leave(done) {
          whatHappened.push(prefix + "leave");
          done();
        },
      });

      r.on("/foo/bar", jest.fn(), createHooks("route_"));
      r.addBeforeHook(r.routes[0], (done) => {
        whatHappened.push("before");
        done();
      });
      r.addLeaveHook(r.routes[0], (done) => {
        whatHappened.push("leave");
        done();
      });
      r.addAfterHook(r.routes[0], () => {
        whatHappened.push("after");
      });
      r.addAlreadyHook(r.routes[0], () => {
        whatHappened.push("already");
      });

      r.navigate("/foo/bar");

      setTimeout(() => {
        r.navigate("/foo/bar");
        r.navigate("/boo");

        expect(whatHappened).toStrictEqual([
          "route_before",
          "before",
          "route_after",
          "after",
          "route_already",
          "already",
          "route_leave",
          "leave",
        ]);

        warn.mockRestore();
        done();
      }, 30);
    });
    it("should provide a mechanism for removing the hook", () => {
      const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
      const r: NavigoRouter = new Navigo("/");
      const handler = jest.fn();
      const hookFunc = jest.fn().mockImplementation((done) => done());
      r.on("/foo/bar", handler);
      const remove = r.addBeforeHook(r.routes[0], hookFunc);

      r.navigate("/foo/bar");
      r.navigate("/boo");
      remove();
      r.navigate("/foo/bar");

      expect(handler).toBeCalledTimes(2);
      expect(hookFunc).toBeCalledTimes(1);
      expect(r.routes[0].hooks.before).toHaveLength(0);

      warn.mockRestore();
    });
    it("should be possible to add a hook based on route name", () => {
      const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
      const r: NavigoRouter = new Navigo("/");
      const handler = jest.fn();
      const hookFunc = jest.fn().mockImplementation((done) => done());
      r.on("/foo/bar", handler);
      r.addBeforeHook("foo/bar", hookFunc);

      r.navigate("/foo/bar");

      expect(handler).toBeCalledTimes(1);
      expect(hookFunc).toBeCalledTimes(1);
      expect(r.routes[0].hooks.before).toHaveLength(1);

      warn.mockRestore();
    });
  });
});
