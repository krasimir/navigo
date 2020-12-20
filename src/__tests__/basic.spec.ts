import Navigo from "../index";

describe("Given the Navigo library", () => {
  describe("when creating a router", () => {
    it("should accept just a function to the `on` method", () => {
      const handler = jest.fn();
      const router: Navigo = new Navigo("/foo");
      router.on(handler);
      expect(router.routes).toStrictEqual([{ path: "foo", handler }]);
    });
    it("should accept path and a function", () => {
      const handler = jest.fn();
      const router: Navigo = new Navigo("/foo");
      router.on("/bar", handler);
      expect(router.routes).toStrictEqual([{ path: "bar", handler }]);
    });
    it("should accept object with paths and handlers", () => {
      const handler = jest.fn();
      const router: Navigo = new Navigo("/foo");
      router.on({
        a: handler,
        b: handler,
      });
      expect(router.routes).toStrictEqual([
        { path: "a", handler },
        { path: "b", handler },
      ]);
    });
    it("should allow chaining of the `on` method", () => {
      const router: Navigo = new Navigo("/");
      router.on("foo", () => {}).on("bar", () => {});
      expect(router.routes).toHaveLength(2);
    });
    it("should start listening to the popstate event", () => {
      const add = jest.spyOn(window, "addEventListener");
      const r: Navigo = new Navigo("/");

      expect(add).toBeCalledWith("popstate", expect.any(Function));
      add.mockRestore();
    });
  });
  describe("when using the clean helper function", () => {
    it("should remove the slashes from the beginning and end of the string", () => {
      const clean = new Navigo("/")._clean;
      [
        ["", ""],
        ["foo", "foo"],
        ["/foo", "foo"],
        ["//foo", "foo"],
        ["///foo", "foo"],
        ["foo/", "foo"],
        ["foo//", "foo"],
        ["foo///", "foo"],
        ["/foo/", "foo"],
        ["/foo//", "foo"],
        ["/foo/bar/", "foo/bar"],
        ["/", ""],
      ].forEach(([i, out]) => {
        expect(clean(i)).toEqual(out);
      });
    });
  });
  describe("when matching a route", () => {
    [
      [
        "",
        "",
        {
          data: null,
          params: null,
        },
      ],
      ["", "/foo/bar", false],
      [
        "/foo/bar",
        "/foo/bar",
        {
          data: null,
          params: null,
          url: "foo/bar",
        },
      ],
      [
        "/foo/bar",
        "/foo/bar/",
        {
          data: null,
          params: null,
        },
      ],
      ["/foo/bar", "/foo/moo", false],
      [
        "/foo/bar",
        "/foo/:name",
        {
          data: { name: "bar" },
          params: null,
        },
      ],
      [
        "/foo/a/b",
        "/foo/:id/:name",
        {
          data: { id: "a", name: "b" },
          params: null,
        },
      ],
      [
        "/foo/a/b?m=n&k=z",
        "/foo/:id/:name",
        {
          data: { id: "a", name: "b" },
          params: { m: "n", k: "z" },
          queryString: "m=n&k=z",
        },
      ],
      [
        "/foo/a/b?zzz=%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B0&building=Empire%20State%20Building%26something&animal=bear&",
        "/foo/:id/:name",
        {
          data: { id: "a", name: "b" },
          params: {
            animal: "bear",
            building: "Empire State Building&something",
            zzz: "оставка",
          },
        },
      ],
      [
        "/foo/a/b?m=n&k=z&k=y",
        "/foo/:id/:name",
        {
          data: { id: "a", name: "b" },
          params: { m: "n", k: ["z", "y"] },
        },
      ],
      [
        "/yes-it-works/",
        ":foo",
        {
          data: { foo: "yes-it-works" },
          params: null,
        },
      ],
      [
        "/foo/a/b?m=n",
        "/foo/*",
        {
          data: null,
          params: { m: "n" },
        },
      ],
      [
        "/foo/a/b?m=n",
        "*",
        {
          data: null,
          params: { m: "n" },
        },
      ],
      ["/foo/user/action/save", "/foo/user", false],
      ["/foo/user", "/foo/user/action/save", false],
    ].forEach(([location, path, expectedResult]) => {
      it(`should ${
        expectedResult ? "match" : "not match"
      } when we have "${location}" as location and "${path}" as route path`, () => {
        const router: Navigo = new Navigo("/");
        // @ts-ignore
        expect(
          router._matchRoute(location as string, {
            path: path as string,
            handler: () => {},
          })
        )[typeof expectedResult === "boolean" ? "toEqual" : "toMatchObject"](
          expectedResult
        );
      });
    });
  });
  describe("when we have a no matching route", () => {
    it("should log a warning and return false", () => {
      const warn = jest.spyOn(console, "warn");
      warn.mockImplementationOnce(() => {});
      const r: Navigo = new Navigo("/");
      const res = r.resolve();

      expect(res).toEqual(false);
      expect(warn).toBeCalledWith(
        `Navigo: "/" didn't match any of the registered routes.`
      );
      warn.mockRestore();
    });
  });
  describe("when resolving a route", () => {
    it("should call our handler", () => {
      const r: Navigo = new Navigo("/");
      const handler = jest.fn();
      r.on("foo/:id", handler);
      r.on("foo/xxx-yyy-zzz", handler);
      r.resolve("/foo/xxx-yyy-zzz");

      expect(handler).toBeCalledTimes(1);
      expect(handler).toBeCalledWith({
        data: { id: "xxx-yyy-zzz" },
        params: null,
        route: expect.any(Object),
        url: expect.any(String),
        queryString: expect.any(String),
      });
    });
    it("should take into account the order of the routes definition", () => {
      const r: Navigo = new Navigo("/");
      const handlerA = jest.fn();
      const handlerB = jest.fn();

      r.on("foo/bar", handlerA);
      r.on("foo/*", handlerB);

      r.resolve("/foo/bar");
      r.resolve("/foo/moo");

      expect(handlerA).toBeCalledTimes(1);
      expect(handlerB).toBeCalledTimes(1);
    });
    it("should call the handler once if the matched route is the same", () => {
      const r: Navigo = new Navigo("/");
      const handler = jest.fn();

      r.on("foo/:id", handler);

      r.resolve("/foo/bar");
      r.resolve("/foo/moo");
      r.resolve("/foo/moo");
      r.resolve("/foo/moo?a=10");

      expect(handler).toBeCalledTimes(3);
      expect(handler.mock.calls[0][0]).toMatchObject({
        data: { id: "bar" },
      });
      expect(handler.mock.calls[1][0]).toMatchObject({
        data: { id: "moo" },
      });
      expect(handler.mock.calls[2][0]).toMatchObject({
        data: { id: "moo" },
        params: { a: "10" },
      });
    });
  });
  describe("when using the `off` method", () => {
    it("should remove the handler from the routes", () => {
      const r: Navigo = new Navigo("/");
      const h = () => {};
      r.on("/foo", () => {}).on("/bar", h);
      expect(r.routes).toHaveLength(2);
      r.off("foo").off(h);
      expect(r.routes).toHaveLength(0);
    });
  });
  describe("when navigating to a route", () => {
    it("should push a new entry via the history api and resolve the route", () => {
      const pushState = jest.spyOn(window.history, "pushState");
      const r: Navigo = new Navigo("/");
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
  });
  describe("when destroying the router", () => {
    it("should empty the routes array and remove the listener to popstate", () => {
      const remove = jest.spyOn(window, "removeEventListener");
      const r: Navigo = new Navigo("/");
      r.on("foo", () => {});

      r.destroy();

      expect(r.routes).toHaveLength(0);
      expect(remove).toBeCalledWith("popstate", expect.any(Function));
    });
  });
  describe("when setting a not found handler", () => {
    it("should fallback to that route if no handler is found", () => {
      history.pushState({}, "", "/foo/bar?a=b");
      const r: Navigo = new Navigo("/");
      const notFound = jest.fn();
      r.notFound(notFound).resolve();

      expect(notFound).toBeCalledWith({
        data: null,
        route: null,
        url: "/foo/bar",
        queryString: "a=b",
        params: { a: "b" },
      });
    });
  });
});
