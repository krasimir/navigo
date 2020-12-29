import NavigoRouter from "../../index";
import Navigo from "../index";
import { parseNavigateToOptions } from "../utils";

describe("Given the Navigo library", () => {
  describe("when we have data-navigo links on the page", () => {
    it("should attach a click handler and call the navigate in case of we click on them", () => {
      const querySelectorAll = jest.spyOn(document, "querySelectorAll");
      const preventDefault = jest.fn();
      const routeHandler = jest.fn();
      let handler;

      // @ts-ignore
      querySelectorAll.mockImplementationOnce(() => {
        return [
          {
            addEventListener(eventType, h) {
              handler = h;
            },
            getAttribute() {
              return "/foo/bar";
            },
          },
        ];
      });

      const r: NavigoRouter = new Navigo("/");
      r.on("/foo/bar", routeHandler);

      handler({
        ctrlKey: false,
        preventDefault,
      });

      expect(preventDefault).toBeCalledTimes(1);
      expect(routeHandler).toBeCalledTimes(1);

      querySelectorAll.mockRestore();
    });
    it("should provide an API for the navigate options", () => {
      const querySelectorAll = jest.spyOn(document, "querySelectorAll");
      let handler;

      // @ts-ignore
      querySelectorAll.mockImplementationOnce(() => {
        return [
          {
            addEventListener(eventType, h) {
              handler = h;
            },
            getAttribute(attr) {
              switch (attr) {
                case "href":
                  return "/foo/bar";
                case "data-navigo-options":
                  return "updateBrowserURL:false, callHandler:false,updateState: false,force: false,historyAPIMethod: replaceState";
              }
            },
          },
        ];
      });

      const r: NavigoRouter = new Navigo("/");
      const navigate = jest.spyOn(r, "navigate");
      r.on("/foo/bar", () => {});

      handler({
        ctrlKey: false,
        preventDefault: () => {},
      });

      expect(navigate).toBeCalledTimes(1);
      expect(navigate).toBeCalledWith("foo/bar", {
        updateBrowserURL: false,
        callHandler: false,
        updateState: false,
        force: false,
        historyAPIMethod: "replaceState",
      });

      querySelectorAll.mockRestore();
    });
    it("should properly parse data-navigo-options attribute", () => {
      expect(
        parseNavigateToOptions(
          " updateBrowserURL  :false,   callHandler :false,updateState: false, force: false   ,historyAPIMethod: replaceState,foo:bar"
        )
      ).toStrictEqual({
        updateBrowserURL: false,
        callHandler: false,
        updateState: false,
        force: false,
        historyAPIMethod: "replaceState",
      });
      expect(parseNavigateToOptions()).toStrictEqual({});
    });
    it("should not failed if the `data-navigo` is set to a non anchor tag", () => {
      const querySelectorAll = jest.spyOn(document, "querySelectorAll");
      let handler;

      // @ts-ignore
      querySelectorAll.mockImplementationOnce(() => {
        return [
          {
            addEventListener(eventType, h) {
              handler = h;
            },
            getAttribute() {
              return null;
            },
          },
        ];
      });

      const r: NavigoRouter = new Navigo("/");
      r.on("/foo/bar", () => {});

      handler({
        ctrlKey: false,
        preventDefault: () => {},
      });
      querySelectorAll.mockRestore();
    });
  });
  describe("when we have an absolute path in the href attribute", () => {
    it("should properly extract the path", () => {
      const querySelectorAll = jest.spyOn(document, "querySelectorAll");
      let handler;
      let routeHandler = jest.fn();

      // @ts-ignore
      querySelectorAll.mockImplementationOnce(() => {
        return [
          {
            addEventListener(eventType, h) {
              handler = h;
            },
            getAttribute(attr) {
              if (attr === "href") {
                return "http://example.com/foo/bar?x=y";
              }
            },
          },
        ];
      });

      const r: NavigoRouter = new Navigo("/");
      r.on("/foo/bar", routeHandler);

      handler({
        ctrlKey: false,
        preventDefault: () => {},
      });

      expect(routeHandler).toBeCalledTimes(1);
      expect(routeHandler).toBeCalledWith({
        data: null,
        params: { x: "y" },
        queryString: "x=y",
        route: {
          handler: expect.any(Function),
          hooks: undefined,
          name: "foo/bar",
          path: "foo/bar",
        },
        url: "foo/bar",
      });

      querySelectorAll.mockRestore();
    });
  });
});
