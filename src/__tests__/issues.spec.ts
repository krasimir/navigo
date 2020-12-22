import Navigo from "../index";

describe("Given the Navigo library", () => {
  describe("and the problem described in #111", () => {
    it("should fallback to that route if no handler is found", () => {
      history.pushState({}, "", "/foo/bar?a=b");
      var handler = jest.fn();
      var notFoundHandler = jest.fn();

      let router = new Navigo("/");
      router.on("/test", handler);
      router.notFound(notFoundHandler);

      router.resolve("/test#someanchor");

      expect(handler).toBeCalledTimes(1);
      expect(notFoundHandler).not.toBeCalled();
    });
  });
  describe("and the problem described in #116", function () {
    it("should handle properly the parameter", function () {
      var handler = jest.fn();

      let router = new Navigo("/");
      handler = jest.fn();
      router.on("/user/:name", handler);
      router.resolve("/user/Krasimir%20Tsonev");
      expect(handler).toBeCalled();
      expect(handler).toBeCalledWith(
        expect.objectContaining({
          data: { name: "Krasimir Tsonev" },
        })
      );
    });
  });
  describe("and the problem described in #128", function () {
    it("should resolve the route", function () {
      var handler = jest.fn();

      let router: Navigo = new Navigo("/");
      router.on("/:moduleName", handler);
      router.notFound(() => {});

      router.resolve("/rock/paper/scissors/");

      expect(handler).not.toBeCalled();
    });
  });
  describe("and the feature described in #136", function () {
    it("should call the already hook", function () {
      const handler = jest.fn();
      const alreadyHandler = jest.fn();
      const router: Navigo = new Navigo("/");

      router.on("/:moduleName", handler, {
        already: alreadyHandler,
      });

      router.resolve("/rock");
      router.resolve("/rock");
      router.resolve("/rock");
      router.resolve("/rock");

      expect(handler).toBeCalledTimes(1);
      expect(alreadyHandler).toBeCalledTimes(3);
    });
  });
  describe("and the feature described in #146", function () {
    it("should resolve the proper route", function () {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      let router: Navigo = new Navigo("/");

      router.on({
        restaurant: handler1,
        "demo/:name": handler2,
      });

      router.navigate("/demo/myrestaurant");

      expect(handler1).not.toBeCalledTimes(1);
      expect(handler2).toBeCalledTimes(1);
      expect(handler2).toBeCalledWith(
        expect.objectContaining({ data: { name: "myrestaurant" } })
      );
    });
  });
  describe("and the feature described in #147", function () {
    it("should provide an API for changing the history API method", function () {
      const push = jest.spyOn(history, "pushState");
      const replace = jest.spyOn(history, "replaceState");
      const router: Navigo = new Navigo("/");

      router.notFound(() => {});
      router.navigate("/rock1");
      router.navigate("/rock2", { historyAPIMethod: "replaceState" });
      router.navigate("/rock3");

      expect(push).toBeCalledTimes(2);
      expect(replace).toBeCalledTimes(1);

      push.mockRestore();
      replace.mockRestore();
    });
  });
  describe("when we use a hash based URL", function () {
    it("should successfully extract only the URL", function () {
      const { extractGETParameters } = new Navigo("/");
      const url = "/employee?spm=abc#/employee/iparents";

      expect(extractGETParameters(url)).toStrictEqual(["employee", "spm=abc"]);
    });
  });
  describe("when we use a non-hash based routing but we have a hash", function () {
    it("should successfully extract only the URL", function () {
      const { extractGETParameters } = new Navigo("/");
      const url = "/employee?spm=abc#/employee/iparents";

      expect(extractGETParameters(url)).toStrictEqual(["employee", "spm=abc"]);
    });
  });
  describe("and the bug described in #162", function () {
    it("should properly resolve the route handler even tho there is no dynamic param", function () {
      const spy = jest.fn();
      const router: Navigo = new Navigo("/");

      router.on("/home", spy);
      router.resolve("/home?hey=bug");

      expect(spy).toBeCalledWith(
        expect.objectContaining({ url: "home", params: { hey: "bug" } })
      );
    });
  });
  describe("and the issue #167", function () {
    it("should have parameterized routes that work", function () {
      const handler = jest.fn();
      const router: Navigo = new Navigo("/");

      router.on("/products/:id", handler);

      router.resolve("/products/421");

      expect(handler).toBeCalledWith(
        expect.objectContaining({ data: { id: "421" } })
      );
    });
  });
  describe("Given the issue #174", function () {
    it("should call the handler when we pass a hook object but no before and after", function () {
      const handler = jest.fn();
      const router: Navigo = new Navigo("/");
      const alreadyHandler = jest.fn();
      const leaveHandler = jest.fn();
      const aboutHandler = jest.fn();

      router.on("/products/:id", handler, {
        already: alreadyHandler,
        leave: leaveHandler,
      });
      router.on("/about", aboutHandler);

      router.resolve("/products/421");
      router.resolve("/products/421");
      router.resolve("/about");

      expect(handler).toBeCalledTimes(1);
      expect(handler).toBeCalledWith(
        expect.objectContaining({ data: { id: "421" } })
      );
      expect(alreadyHandler).toBeCalledTimes(1);
      expect(alreadyHandler).toBeCalledWith(
        expect.objectContaining({
          data: { id: "421" },
        })
      );
      expect(leaveHandler).toBeCalledTimes(1);
      expect(aboutHandler).toBeCalledTimes(1);
    });
  });
});
