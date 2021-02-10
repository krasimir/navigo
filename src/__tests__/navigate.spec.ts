import NavigoRouter from "../../index";
import Navigo from "../index";

describe("Given the Navigo library", () => {
  describe("when navigating to a route", () => {
    it("should show a deprecation warnings for shouldResolve and silent", () => {
      const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
      const r: NavigoRouter = new Navigo("/");
      r.notFound(() => {});

      // @ts-ignore
      r.navigate("/foo", { shouldResolve: false });
      // @ts-ignore
      r.navigate("/bar", { silent: true });

      expect(warn).toBeCalledTimes(2);
      expect(warn.mock.calls[0][0]).toEqual(
        `"shouldResolve" is deprecated. Please check the documentation.`
      );
      expect(warn.mock.calls[1][0]).toEqual(
        `"silent" is deprecated. Please check the documentation.`
      );
      warn.mockRestore();
    });
    it("should push a new entry via the history api and resolve the route", () => {
      const pushState = jest.spyOn(window.history, "pushState");
      const r: NavigoRouter = new Navigo("/");
      const handler = jest.fn();

      r.on("/foo/bar", handler).on("/about", handler).on("*", handler);

      r.navigate("about");

      expect(handler).toBeCalledTimes(1);
      expect(handler.mock.calls[0][0]).toMatchObject({
        route: expect.objectContaining({ path: "about" }),
      });
      expect(pushState).toBeCalledWith({}, "", "/about");
      pushState.mockRestore();
    });
    it("should not update the browser URL if `updateBrowserURL` is set to `false`", () => {
      const push = jest.spyOn(window.history, "pushState");
      const r: NavigoRouter = new Navigo("/");

      r.notFound(() => {});
      r.navigate("/foo", { updateBrowserURL: false });

      expect(push).not.toBeCalled();
      push.mockRestore();
    });
    it("should not call our handler if `callHandler` is set to `false`", () => {
      const r: NavigoRouter = new Navigo("/");
      const handler = jest.fn();

      r.on("/foo", handler);
      r.navigate("/foo", { callHandler: false });

      expect(handler).not.toBeCalled();
    });
    it("should not update the internal state if `updateState` is equal to false", () => {
      const r: NavigoRouter = new Navigo("/");

      r.on("/foo", () => {});
      r.navigate("/foo", { updateState: false });

      expect(r.lastResolved()).toEqual(null);
      expect(r.current).toEqual(null);
    });
    it("should NOT resolve any routes if `callHandler` is set to `false`", () => {
      const pushState = jest.spyOn(window.history, "pushState");
      const r: NavigoRouter = new Navigo("/");
      const handler = jest.fn();

      r.on("/foo", handler).on("/about", handler).on("*", handler);

      r.navigate("about");
      r.navigate("foo", { callHandler: false });
      r.navigate("blah", { callHandler: false });

      expect(handler).toBeCalledTimes(1);
      expect(handler.mock.calls[0][0]).toMatchObject({
        route: expect.objectContaining({ path: "about" }),
      });
      expect(pushState).toBeCalledTimes(3);
      expect(pushState).toBeCalledWith({}, "", "/about");
      expect(pushState).toBeCalledWith({}, "", "/foo");
      expect(pushState).toBeCalledWith({}, "", "/blah");
      pushState.mockRestore();
    });
    describe("and when we use force: true", () => {
      it("should only update the `current` (last resolved) and should not update the browser url and should not update the current state, neither call a handler", () => {
        const push = jest.spyOn(window.history, "pushState");
        const r: NavigoRouter = new Navigo("/");
        const handler = jest.fn();
        r.on("about", () => {})
          .on("products", () => {})
          .on("/login", handler);
        r.navigate("login?a=b", {
          force: true,
        });

        const expected = [
          {
            url: "login",
            data: null,
            queryString: "a=b",
            hashString: "",
            params: { a: "b" },
            route: {
              handler: expect.any(Function),
              hooks: {},
              name: "login",
              path: "login",
            },
          },
        ];

        expect(r.lastResolved()).toStrictEqual(expected);
        expect(r.current).toStrictEqual(expected);
        expect(push).not.toBeCalled();
        expect(handler).not.toBeCalled();
        push.mockRestore();
      });
    });
    it("should be possible to call the handler only without updating the browser URL", () => {
      const push = jest.spyOn(window.history, "pushState");
      const r: NavigoRouter = new Navigo("/");
      const handler = jest.fn();
      r.on("/login", handler);

      r.navigate("login?a=b", {
        updateBrowserURL: false,
        updateState: false,
      });

      expect(r.lastResolved()).toEqual(null);
      expect(r.current).toEqual(null);
      expect(push).not.toBeCalled();
      expect(handler).toBeCalledTimes(1);
      expect(handler).toBeCalledWith(
        expect.objectContaining({
          params: { a: "b" },
          url: "login",
        })
      );
      push.mockRestore();
    });
    describe("and when we have a specified root", () => {
      it("should properly set the `to` and `currentLocationPath` to contain the root path", () => {
        const r: NavigoRouter = new Navigo("/app");
        const handler = jest.fn();
        r.on("/about", handler);
        r.navigate("/about");

        expect(handler).toBeCalledTimes(1);
        expect(location.pathname).toEqual("/app/about");
      });
    });
    describe("and we use the `navigateByName` method", () => {
      it("should allow us to navigate to a route by its name", () => {
        const r: NavigoRouter = new Navigo("/");
        const handler = jest.fn();
        r.on({
          "/users/:name": { as: "user", uses: handler },
        });

        r.navigateByName("user", { name: "Krasimir" });

        expect(handler).toBeCalledTimes(1);
        expect(handler).toBeCalledWith(
          expect.objectContaining({
            url: "users/Krasimir",
          })
        );
      });
      it("should do nothing if the route by this name doesn't exist", () => {
        const r: NavigoRouter = new Navigo("/");
        const handler = jest.fn();
        r.on({
          "/users/:name": { as: "user", uses: handler },
        });

        r.navigateByName("blah");

        expect(handler).not.toBeCalled();
      });
    });
    describe("and we have a hash in the URL", () => {
      it("should keep the hash in the URL and make accessible in the Match object", () => {
        const handler = jest.fn();
        const r: NavigoRouter = new Navigo("/");

        r.on({
          appointments: {
            as: "myRoute",
            uses: handler,
          },
        });
        r.navigate("/appointments?#start=2021-01-01&appointmentId=1");

        expect(location.pathname).toBe("/appointments");
        expect(location.hash).toBe("#start=2021-01-01&appointmentId=1");
        expect(handler).toBeCalledTimes(1);
        expect(handler).toBeCalledWith({
          data: null,
          params: null,
          queryString: "",
          hashString: "start=2021-01-01&appointmentId=1",
          route: {
            handler: expect.any(Function),
            hooks: {},
            name: "myRoute",
            path: "appointments",
          },
          url: "appointments",
        });
      });
    });
    describe("when we navigate as part of a handler", () => {
      it("should set a proper `current`", () => {
        const r: NavigoRouter = new Navigo("/app");
        const h1 = jest.fn();
        const h2 = jest.fn().mockImplementation(() => {
          r.navigate("/login");
        });

        r.on("login", h1);
        r.on("*", h2);
        r.resolve();

        expect(location.pathname).toBe("/app/login");
        expect(r.current).toStrictEqual([
          expect.objectContaining({
            url: "login",
          }),
        ]);
      });
    });
  });
});
