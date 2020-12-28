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

      const r: Navigo = new Navigo("/");
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

      const r: Navigo = new Navigo("/");
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
  });
});
