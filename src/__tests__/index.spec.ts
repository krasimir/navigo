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
      ["", "", {}],
      ["", "/foo/bar", false],
      ["/foo/bar", "/foo/bar", {}],
      ["/foo/bar", "/foo/bar/", {}],
      ["/foo/bar", "/foo/moo", false],
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
