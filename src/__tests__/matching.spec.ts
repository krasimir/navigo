import NavigoRouter from "../../index";
import Navigo from "../index";

describe("Given the Navigo library", () => {
  beforeEach(() => {
    history.pushState({}, "", "/");
  });
  describe("when matching a route", () => {
    [
      [
        "",
        "",
        {
          data: null,
          params: null,
        },
      ],
      ["", "/foo/bar", false],
      [
        "/foo/bar",
        "/foo/bar",
        {
          data: null,
          params: null,
          url: "foo/bar",
        },
      ],
      [
        "/foo/bar",
        "/foo/bar/",
        {
          data: null,
          params: null,
        },
      ],
      ["/foo/bar", "/foo/moo", false],
      [
        "/foo/bar",
        "/foo/:name",
        {
          data: { name: "bar" },
          params: null,
        },
      ],
      [
        "/foo/a/b",
        "/foo/:id/:name",
        {
          data: { id: "a", name: "b" },
          params: null,
        },
      ],
      [
        "/foo/a/b?m=n&k=z",
        "/foo/:id/:name",
        {
          data: { id: "a", name: "b" },
          params: { m: "n", k: "z" },
          queryString: "m=n&k=z",
        },
      ],
      [
        "/foo/a/b?zzz=%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B0&building=Empire%20State%20Building%26something&animal=bear&",
        "/foo/:id/:name",
        {
          data: { id: "a", name: "b" },
          params: {
            animal: "bear",
            building: "Empire State Building&something",
            zzz: "оставка",
          },
        },
      ],
      [
        "/foo/a/b?m=n&k=z&k=y",
        "/foo/:id/:name",
        {
          data: { id: "a", name: "b" },
          params: { m: "n", k: ["z", "y"] },
        },
      ],
      [
        "/yes-it-works/",
        ":foo",
        {
          data: { foo: "yes-it-works" },
          params: null,
        },
      ],
      [
        "/foo/a/b?m=n",
        "/foo/*",
        {
          data: null,
          params: { m: "n" },
        },
      ],
      [
        "/foo/a/b?m=n",
        "*",
        {
          data: null,
          params: { m: "n" },
        },
      ],
      ["/foo/user/action/save", "/foo/user", false],
      ["/foo/user", "/foo/user/action/save", false],
      ["/noo", "/", false],
      ["/", "/", { data: null, params: null, url: "" }],
      ["/rock/paper/scissors/", "/:moduleName", false],
      [
        "/rock/paper/scissors",
        /rock\/(.*)\/(.*)/,
        { data: ["paper", "scissors"] },
      ],
      ["/rock/?a=b&c=d", "/rock", { data: null, params: { a: "b", c: "d" } }],
      ["/foo/20/save", "/foo/:id/?", { data: { id: "20" } }],
      ["/foo/20", "/foo/:id/?", { data: { id: "20" } }],
      ["/foo/20/save/nope", "/foo/:id/?", false],
      ["/foo/20/save/nope", "/foo/:id/?/?", { data: { id: "20" } }],
    ].forEach(([location, path, expectedResult, only]) => {
      const f = only ? fit : it;
      f(
        `should ${
          expectedResult ? "match" : "not match"
        } when we have "${location}" as location and "${path}" as route path`,
        () => {
          const router: NavigoRouter = new Navigo("/");
          // @ts-ignore
          router.on(path, () => {});
          // @ts-ignore
          const res = router.match(location as string);
          if (typeof expectedResult === "boolean") {
            expect(res).toEqual(false);
          } else {
            expect(res[0]).toMatchObject(expectedResult);
          }
        }
      );
    });
    it("should provide an API for direct matching of the routes", () => {
      const r: NavigoRouter = new Navigo("/");

      r.on("/foo", () => {});
      r.on("/user/:id", () => {});

      expect(r.match("/nope")).toEqual(false);
      expect(r.match("/user/xxx/?a=b")).toStrictEqual([
        {
          data: {
            id: "xxx",
          },
          params: { a: "b" },
          queryString: "a=b",
          route: {
            handler: expect.any(Function),
            hooks: {},
            name: "user/:id",
            path: "user/:id",
          },
          url: "user/xxx",
        },
      ]);
    });
  });
  describe("when matching routes and we have a root set up", () => {
    describe("and when we use a whilecard #", () => {
      it("should match #1", () => {
        const handler = jest.fn();
        const r: NavigoRouter = new Navigo("/app");
        r.on("*", handler);

        r.resolve("/foo/bar");

        expect(handler).toBeCalled();
      });
      it("should match #2", () => {
        const handler = jest.fn();
        const r: NavigoRouter = new Navigo("/app");
        r.on("*", handler);

        r.resolve("/");

        expect(handler).toBeCalled();
      });
    });
  });
});
