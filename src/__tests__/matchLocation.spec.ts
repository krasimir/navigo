import NavigoRouter from "../../index";
import Navigo from "../index";

describe("Given the Navigo library", () => {
  beforeEach(() => {
    history.pushState({}, "", "/");
  });
  describe("when using the `matchLocation` method", () => {
    it("should allow us to use only the matching logic of the router", () => {
      const r: NavigoRouter = new Navigo("/");

      expect(r.matchLocation("/foo/:id", "/foo/bar?a=b")).toStrictEqual({
        data: {
          id: "bar",
        },
        params: { a: "b" },
        queryString: "a=b",
        hashString: "",
        route: {
          handler: expect.any(Function),
          hooks: {},
          name: "foo/:id",
          path: "foo/:id",
        },
        url: "foo/bar",
      });
      expect(r.matchLocation("/nope", "/something-else")).toEqual(false);
    });
  });
});
