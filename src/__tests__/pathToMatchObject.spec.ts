import NavigoRouter from "../../index";
import Navigo from "../index";

describe("Given the Navigo library", () => {
  beforeEach(() => {
    history.pushState({}, "", "/");
  });
  describe("when using `pathToMatchObject` method", () => {
    it("should convert a path to a Match object", () => {
      const r: NavigoRouter = new Navigo("/");
      r.hooks({
        leave: () => {},
      });
      expect(r._pathToMatchObject("/foo/bar?a=b")).toStrictEqual({
        data: null,
        params: { a: "b" },
        queryString: "a=b",
        route: {
          handler: expect.any(Function),
          hooks: {
            leave: expect.any(Function),
          },
          name: "foo/bar",
          path: "foo/bar",
        },
        url: "foo/bar",
      });
    });
  });
});
