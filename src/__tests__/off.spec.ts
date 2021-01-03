import NavigoRouter from "../../index";
import Navigo from "../index";

describe("Given the Navigo library", () => {
  beforeEach(() => {
    history.pushState({}, "", "/");
  });
  describe("when using the `off` method", () => {
    it("should remove the handler from the routes", () => {
      const r: NavigoRouter = new Navigo("/");
      const h = () => {};
      r.on("/foo", () => {}).on("/bar", h);
      expect(r.routes).toHaveLength(2);
      r.off("foo").off(h);
      expect(r.routes).toHaveLength(0);
    });
    describe("and when the path is a RegExp", () => {
      it("should still work", () => {
        const r: NavigoRouter = new Navigo("/");
        const h = () => {};
        r.on(/foo/, () => {}).on(/bar/, h);
        expect(r.routes).toHaveLength(2);
        r.off(/foo/).off(h);
        expect(r.routes).toHaveLength(0);
      });
    });
  });
});
