import NavigoRouter from "../../index";
import Navigo from "../index";

describe("Given the Navigo library", () => {
  beforeEach(() => {
    history.pushState({}, "", "/");
  });
  describe("when destroying the router", () => {
    it("should empty the routes array and remove the listener to popstate", () => {
      const remove = jest.spyOn(window, "removeEventListener");
      const r: NavigoRouter = new Navigo("/");
      r.on("foo", () => {});

      r.destroy();

      expect(r.routes).toHaveLength(0);
      expect(remove).toBeCalledWith("popstate", expect.any(Function));
      expect(r.destroyed).toEqual(true);
    });
  });
});
