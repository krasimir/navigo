import Navigo from "../index";

describe("Given the Navigo library", () => {
  describe("when creating a router", () => {
    it("should accept just a function to the `on` method", () => {
      const handler = jest.fn();
      const router = new Navigo("/foo");
      router.on(handler);
      expect(router.routes).toStrictEqual([{ path: "foo", handler }]);
    });
    it("should accept path and a function", () => {
      const handler = jest.fn();
      const router = new Navigo("/foo");
      router.on("/bar", handler);
      expect(router.routes).toStrictEqual([{ path: "bar", handler }]);
    });
    it("should accept object with paths and handlers", () => {
      const handler = jest.fn();
      const router = new Navigo("/foo");
      router.on({
        a: handler,
        b: handler,
      });
      expect(router.routes).toStrictEqual([
        { path: "a", handler },
        { path: "b", handler },
      ]);
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
      ].forEach(([i, out]) => {
        expect(clean(i)).toEqual(out);
      });
    });
  });
  describe("when resolving routes", () => {
    [
      ["", "", { data: null, params: null }],
      ["", "/foo/bar", false],
      ["/foo/bar", "/foo/bar", { data: null, params: null }],
      ["/foo/bar", "/foo/bar/", { data: null, params: null }],
      ["/foo/bar", "/foo/moo", false],
      ["/foo/bar", "/foo/:name", { data: { name: "bar" }, params: null }],
      [
        "/foo/a/b",
        "/foo/:id/:name",
        { data: { id: "a", name: "b" }, params: null },
      ],
      [
        "/foo/a/b?m=n&k=z",
        "/foo/:id/:name",
        { data: { id: "a", name: "b" }, params: { m: "n", k: "z" } },
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
        { data: { id: "a", name: "b" }, params: { m: "n", k: ["z", "y"] } },
      ],
      [
        "/yes-it-works/",
        ":foo",
        { data: { foo: "yes-it-works" }, params: null },
      ],
      ["/foo/a/b?m=n", "/foo/*", { data: null, params: { m: "n" } }],
      ["/foo/a/b?m=n", "*", { data: null, params: { m: "n" } }],
    ].forEach(([location, path, expectedResult]) => {
      it(`should ${
        expectedResult ? "match" : "not match"
      } when we have "${location}" as location and "${path}" as route path`, () => {
        const router = new Navigo("/");
        expect(
          router._matchRoute(location, { path, handler: () => {} })
        ).toStrictEqual(expectedResult);
      });
    });
  });
});
