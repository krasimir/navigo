import Navigo from "../index";

describe("Given the Navigo library", () => {
  describe("when creating a router", () => {
    it("should accept just a function to the `on` method", () => {
      const handler = jest.fn();
      const router = new Navigo("/foo");
      router.on(handler);
      expect(router.routes).toStrictEqual([{ path: "/foo", handler }]);
    });
    it("should accept path and a function", () => {
      const handler = jest.fn();
      const router = new Navigo("/foo");
      router.on("/bar", handler);
      expect(router.routes).toStrictEqual([{ path: "/bar", handler }]);
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
});
