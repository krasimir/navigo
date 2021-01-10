import NavigoRouter from "../../index";
import Navigo from "../index";

describe("Given the Navigo library", () => {
  beforeEach(() => {
    history.pushState({}, "", "/");
  });
  describe("when using the getRoute method", () => {
    it("should a route by name or undefined", () => {
      const r: NavigoRouter = new Navigo("/");
      r.on("foo", () => {});
      r.on({
        "/bar": {
          as: "xxx",
          uses: () => {},
        },
      });
      r.on(/foo(.*)/, () => {});

      expect(r.routes).toHaveLength(3);
      expect(r.getRoute("foo")).toStrictEqual(r.routes[0]);
      expect(r.getRoute("xxx")).toStrictEqual(r.routes[1]);
      expect(r.getRoute("foo(.*)")).toStrictEqual(r.routes[2]);
      expect(r.getRoute("nope")).toEqual(undefined);
    });
    it("should fond a route when we have router's root set up", () => {
      const r: NavigoRouter = new Navigo("/app");
      r.on("foo", () => {});

      expect(r.getRoute("foo")).toStrictEqual(r.routes[0]);
    });
  });
});
