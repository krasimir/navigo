import NavigoRouter from "../../index";
import Navigo from "../index";

describe("Given the Navigo library", () => {
  beforeEach(() => {
    history.pushState({}, "", "/");
  });
  describe("when setting a not found handler", () => {
    it("should fallback to that route if no handler is found", () => {
      history.pushState({}, "", "/foo/bar?a=b");
      const r: NavigoRouter = new Navigo("/");
      const notFound = jest.fn();
      r.notFound(notFound).resolve();

      expect(notFound).toBeCalledWith({
        data: null,
        route: {
          handler: expect.any(Function),
          hooks: undefined,
          path: "foo/bar",
          name: "__NOT_FOUND__",
        },
        url: "foo/bar",
        queryString: "a=b",
        params: { a: "b" },
      });
    });
  });
});
