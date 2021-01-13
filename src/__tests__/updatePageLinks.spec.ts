import NavigoRouter from "../../index";
import Navigo from "../index";
import { parseNavigateOptions } from "../utils";

describe("Given the Navigo library", () => {
  // beforeEach(() => {
  //   history.pushState({}, "", "/");
  // });
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
        stopPropagation: () => {},
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
                  return "updateBrowserURL:false, callHandler:false,updateState: false,force: false,historyAPIMethod: replaceState,resolveOptionsStrategy: ALL";
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
        stopPropagation: () => {},
      });

      expect(navigate).toBeCalledTimes(1);
      expect(navigate).toBeCalledWith("foo/bar", {
        updateBrowserURL: false,
        callHandler: false,
        updateState: false,
        force: false,
        historyAPIMethod: "replaceState",
        resolveOptions: { strategy: "ALL" },
      });

      querySelectorAll.mockRestore();
    });
    it("should properly parse data-navigo-options attribute", () => {
      expect(
        parseNavigateOptions(
          " updateBrowserURL  :false,   callHandler :false,updateState: false, force: false   ,historyAPIMethod: replaceState,foo:bar, resolveOptionsStrategy:    ALL, resolveOptionsHash: true"
        )
      ).toStrictEqual({
        updateBrowserURL: false,
        callHandler: false,
        updateState: false,
        force: false,
        historyAPIMethod: "replaceState",
        resolveOptions: {
          strategy: "ALL",
          hash: true,
        },
      });
      expect(parseNavigateOptions()).toStrictEqual({});
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
        stopPropagation: () => {},
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
        stopPropagation: () => {},
      });

      expect(routeHandler).toBeCalledTimes(1);
      expect(routeHandler).toBeCalledWith({
        data: null,
        params: { x: "y" },
        queryString: "x=y",
        route: {
          handler: expect.any(Function),
          hooks: {},
          name: "foo/bar",
          path: "foo/bar",
        },
        url: "foo/bar",
      });

      querySelectorAll.mockRestore();
    });
  });
  describe("when we have a link with a hash (issue #111)", () => {
    it("should keep the hash when updating the browser URL", (done) => {
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
                return "/foo/bar#should-work";
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
        stopPropagation: () => {},
      });

      // setTimeout to exercise the anchor fix in the _updateBrowserURL
      setTimeout(() => {
        expect(routeHandler).toBeCalledTimes(1);
        expect(location.pathname + location.search + location.hash).toEqual(
          "/foo/bar#should-work"
        );
        done();
      }, 50);

      querySelectorAll.mockRestore();
    });
  });
  describe("when we have a router root set", () => {
    it("should navigate to the proper URL", (done) => {
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
                return "/foo/bar";
              }
            },
          },
        ];
      });

      const r: NavigoRouter = new Navigo("/app");
      r.on("/foo/bar", routeHandler);

      handler({
        ctrlKey: false,
        preventDefault: () => {},
        stopPropagation: () => {},
      });

      // setTimeout to exercise the anchor fix in the _updateBrowserURL
      setTimeout(() => {
        expect(routeHandler).toBeCalledTimes(1);
        expect(location.pathname).toEqual("/app/foo/bar");
        done();
        querySelectorAll.mockRestore();
      }, 50);
    });
  });
  describe("when the value of data-navigo is set to `false`", () => {
    it("should skip the link", () => {
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
              if (attr === "href") {
                return "/foo/bar";
              } else if (attr === "data-navigo") {
                return "false";
              }
            },
          },
        ];
      });

      new Navigo("/app");

      expect(handler).toEqual(undefined);
      querySelectorAll.mockRestore();
    });
  });
  describe("when set data-navigo to `false` later on", () => {
    it("should remove the listener from the link", () => {
      const querySelectorAll = jest.spyOn(document, "querySelectorAll");
      let count = 0;
      const addEventListener = jest.fn();
      const removeEventListener = jest.fn();
      const link = {
        addEventListener,
        removeEventListener,
        getAttribute(attr) {
          count += 1;
          if (attr === "href") {
            return "/foo/bar";
          } else if (attr === "data-navigo") {
            if (count === 1) return "";
            return "false";
          }
        },
      };

      // @ts-ignore
      querySelectorAll.mockImplementation(() => [link]);

      const r: NavigoRouter = new Navigo("/app");
      r.updatePageLinks();

      expect(addEventListener).toBeCalledTimes(1);
      expect(removeEventListener).toBeCalledTimes(1);
      querySelectorAll.mockRestore();
    });
  });
  describe('when we have `target="_blank"` attribute', () => {
    it("should skip the link", () => {
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
              if (attr === "href") {
                return "/foo/bar";
              } else if (attr === "target") {
                return "_blank";
              }
            },
          },
        ];
      });

      new Navigo("/app");

      expect(handler).toEqual(undefined);
      querySelectorAll.mockRestore();
    });
  });
});
