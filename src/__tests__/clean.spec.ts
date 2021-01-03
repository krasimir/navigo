import NavigoRouter from "../../index";
import Navigo from "../index";

describe("Given the Navigo library", () => {
  beforeEach(() => {
    history.pushState({}, "", "/");
  });
  describe("when using the clean helper function", () => {
    it("should remove the slashes from the beginning and end of the string", () => {
      const clean = new Navigo("/")._clean;
      [
        ["", ""],
        ["foo", "foo"],
        ["/foo", "foo"],
        ["//foo", "foo"],
        ["///foo", "foo"],
        ["foo/", "foo"],
        ["foo//", "foo"],
        ["foo///", "foo"],
        ["/foo/", "foo"],
        ["/foo//", "foo"],
        ["/foo/bar/", "foo/bar"],
        ["/", ""],
      ].forEach(([i, out]) => {
        expect(clean(i)).toEqual(out);
      });
    });
  });
});
