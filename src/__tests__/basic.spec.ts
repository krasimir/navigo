import Navigo from "../index";

describe("Given the Navigo library", () => {
  beforeEach(() => {
    history.pushState({}, "", "/");
  });
  describe("when creating a router", () => {
    it("should accept just a function to the `on` method", () => {
      const handler = jest.fn();
      const router: Navigo = new Navigo("/foo");
      router.on(handler);
      expect(router.routes).toStrictEqual([
        { path: "foo", handler, hooks: undefined },
      ]);
    });
    it("should accept path and a function", () => {
      const handler = jest.fn();
      const router: Navigo = new Navigo("/foo");
      router.on("/bar", handler);
      expect(router.routes).toStrictEqual([
        { path: "bar", handler, hooks: undefined },
      ]);
    });
    it("should accept object with paths and handlers", () => {
      const handler = jest.fn();
      const router: Navigo = new Navigo("/foo");
      router.on({
        a: handler,
        b: handler,
      });
      expect(router.routes).toStrictEqual([
        { path: "a", handler, hooks: undefined },
        { path: "b", handler, hooks: undefined },
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
      ["/noo", "/", false],
      ["/", "/", { data: null, params: null, url: "" }],
      ["/rock/paper/scissors/", "/:moduleName", false],
    ].forEach(([location, path, expectedResult, only]) => {
      const f = only ? fit : it;
      f(
        `should ${
          expectedResult ? "match" : "not match"
        } when we have "${location}" as location and "${path}" as route path`,
        () => {
          const router: Navigo = new Navigo("/");
          // @ts-ignore
          expect(
            router._matchRoute(location as string, {
              path: path as string,
              handler: () => {},
              hooks: undefined,
            })
          )[typeof expectedResult === "boolean" ? "toEqual" : "toMatchObject"](
            expectedResult
          );
        }
      );
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
      expect(r.destroyed).toEqual(true);
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
        route: {
          handler: expect.any(Function),
          hooks: undefined,
          path: "foo/bar",
        },
        url: "foo/bar",
        queryString: "a=b",
        params: { a: "b" },
      });
    });
  });
  describe("when we have data-navigo links on the page", () => {
    it("should attach a click handler and call the navigate in case of we click on them", () => {
      const querySelectorAll = jest.spyOn(document, "querySelectorAll");
      const preventDefault = jest.fn();
      const routeHandler = jest.fn();
      let handler;

      // @ts-ignore
      querySelectorAll.mockImplementationOnce(() => {
        return [
          {
            addEventListener(eventType, h) {
              handler = h;
            },
            getAttribute() {
              return "/foo/bar";
            },
          },
        ];
      });

      const r: Navigo = new Navigo("/");
      r.on("/foo/bar", routeHandler);

      handler({
        ctrlKey: false,
        preventDefault,
      });

      expect(preventDefault).toBeCalledTimes(1);
      expect(routeHandler).toBeCalledTimes(1);

      querySelectorAll.mockRestore();
    });
  });
  describe("when using the `link` method", () => {
    it("should return the composed url", () => {
      const r: Navigo = new Navigo("/my/root");

      expect(r.link("something/else")).toEqual("/my/root/something/else");
    });
  });
  describe("when using the `before` hook", () => {
    it("should call the hook before resolving a handler", () => {
      const r: Navigo = new Navigo("/");
      const order = [];
      const h1 = jest.fn().mockImplementation(() => order.push(1));
      const h2 = jest.fn().mockImplementation(() => order.push(2));
      const expectedMatch = {
        data: { id: "100" },
        params: { a: "b" },
        queryString: "a=b",
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
      const r: Navigo = new Navigo("/");
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
  });
  describe("when using the `after` hook", () => {
    it("should fire the hook when the handler is resolved", () => {
      const r: Navigo = new Navigo("/");
      const order = [];
      const h1 = jest.fn().mockImplementation(() => order.push(1));
      const h2 = jest.fn().mockImplementation(() => order.push(2));
      const expectedMatch = {
        data: { id: "100" },
        params: { a: "b" },
        queryString: "a=b",
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
  });
  describe("when using the `leave` hook", () => {
    it("should fire the hook when we leave out of a route", () => {
      const r: Navigo = new Navigo("/");
      const order = [];
      const h1 = jest.fn().mockImplementation(() => order.push(1));
      const h2 = jest.fn().mockImplementation(() => order.push(2));
      const h3 = jest.fn().mockImplementation(() => order.push(3));
      const expectedMatch = {
        data: { id: "100" },
        params: { a: "b" },
        queryString: "a=b",
        route: expect.any(Object),
        url: "foo/100",
      };

      r.on("/foo/:id", h2)
        .on("/", h1, {
          leave(match) {
            h3(match);
          },
        })
        .resolve();

      r.resolve("/foo/100?a=b");

      expect(h1).toBeCalledWith(expect.objectContaining({ url: "" }));
      expect(h2).toBeCalledWith(expectedMatch);
      expect(h3).toBeCalledWith(expectedMatch);
      expect(order).toStrictEqual([1, 3, 2]);
    });
  });
  describe("when using the `already` hook", () => {
    it("should fire the hook when we are matching the same handler", () => {
      const r: Navigo = new Navigo("/");
      const order = [];
      const h1 = jest.fn().mockImplementation(() => order.push(1));
      const h2 = jest.fn().mockImplementation(() => order.push(2));
      const expectedMatch = {
        data: { id: "100" },
        params: { a: "b" },
        queryString: "a=b",
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
  });
  describe("when passing hooks to the default handler", () => {
    it("should use the hooks", () => {
      const r: Navigo = new Navigo("/");
      const order = [];
      const h1 = jest.fn().mockImplementation(() => order.push(1));
      const h2 = jest.fn().mockImplementation(() => order.push(2));
      const h3 = jest.fn().mockImplementation(() => order.push(3));
      const expectedMatch = {
        data: null,
        params: null,
        queryString: "",
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
      const r: Navigo = new Navigo("/");
      const order = [];
      const h1 = jest.fn().mockImplementation(() => order.push(1));
      const h2 = jest.fn().mockImplementation(() => order.push(2));
      const h3 = jest.fn().mockImplementation(() => order.push(3));
      const expectedMatch = {
        data: null,
        params: null,
        queryString: "",
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
      const r: Navigo = new Navigo("/");
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
  });
  describe("when pausing the router", () => {
    it("should", () => {
      //
    });
  });
});
