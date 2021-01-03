import NavigoRouter from "../../index";
import Navigo from "../index";

describe("Given the Navigo library", () => {
  beforeEach(() => {
    history.pushState({}, "", "/");
  });
  describe("when using the `link` method", () => {
    it("should return the composed url", () => {
      const r: NavigoRouter = new Navigo("/my/root");

      expect(r.link("something/else")).toEqual("/my/root/something/else");
    });
  });
});
