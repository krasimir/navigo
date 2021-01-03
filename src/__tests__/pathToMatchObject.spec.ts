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
  describe("when using `getCurrentLocation`", () => {
    it("should return a Match object respecting the root of the router #1", () => {
      history.pushState({}, "", "/app/about/team?users=100");
      const r: NavigoRouter = new Navigo("app");
      expect(r.getCurrentLocation()).toStrictEqual({
        url: "about/team",
        queryString: "users=100",
        route: {
          name: "about/team",
          path: "app/about/team",
          handler: expect.any(Function),
          hooks: undefined,
        },
        data: null,
        params: { users: "100" },
      });
    });
    it("should return a Match object respecting the root of the router #1", () => {
      history.pushState({}, "", "/app/about/team?users=100");
      const r: NavigoRouter = new Navigo("/");
      expect(r.getCurrentLocation()).toStrictEqual({
        url: "app/about/team",
        queryString: "users=100",
        route: {
          name: "app/about/team",
          path: "app/about/team",
          handler: expect.any(Function),
          hooks: undefined,
        },
        data: null,
        params: { users: "100" },
      });
    });
  });
});
