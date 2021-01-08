import NavigoRouter from "../../index";
import Navigo from "../index";

function expectBrowserURL(expected: string) {
  expect(location.pathname + location.search + location.hash).toEqual(expected);
}

describe("Given the Navigo library", () => {
  beforeEach(() => {
    history.pushState({}, "", "/");
  });
  describe("when using the router in a hash mode", () => {
    it("should resolve the hash string", () => {
      history.pushState({}, "", "/app/foo/bar#/about/team");
      const r: NavigoRouter = new Navigo("/", { hash: true });
      const handler = jest.fn();

      r.on("about/team", handler);
      r.resolve();

      expect(handler).toBeCalledTimes(1);
    });
    it("should change the hash when we navigate", () => {
      history.pushState({}, "", "/app/foo/bar");
      const r: NavigoRouter = new Navigo("/", { hash: true });
      const handler = jest.fn();

      r.on("about/team", handler);
      r.navigate("about/team");

      expect(handler).toBeCalledTimes(1);
      expectBrowserURL("/app/foo/bar#/about/team");
    });
  });
});
