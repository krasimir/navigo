import Q from "../Q";

describe("Given the Navigo library", () => {
  beforeEach(() => {
    history.pushState({}, "", "/");
  });
  describe("when using the `Q`", () => {
    it("should allow us to add functions and run them one after each other sharing the same context", () => {
      const context = { data: [] };
      Q(
        [
          (context, done) => {
            context.data.push("a");
            done();
          },
          (context, done) => {
            context.data.push("b");
            done();
          },
          (context, done) => {
            context.data.push("c");
            done();
          },
        ],
        context
      );
      expect(context.data).toStrictEqual(["a", "b", "c"]);
    });
    it("should allow us to block the Q", () => {
      const context = { data: [] };
      Q(
        [
          (context, done) => {
            context.data.push("a");
            done();
          },
          (context, done) => {
            context.data.push("b");
            done(false);
          },
          (context, done) => {
            context.data.push("c");
            done();
          },
        ],
        context
      );
      expect(context.data).toStrictEqual(["a", "b"]);
    });
    it("should allow us to conditionally control the content of the Q", () => {
      const context = { data: [], flag: true };
      Q(
        [
          (context, done) => {
            context.data.push("a");
            done();
          },
          (context, done) => {
            context.data.push("b");
            context.flag = false;
            done();
          },
          Q.if(
            (context) => context.flag,
            [
              (context, done) => {
                context.data.push("c");
                done();
              },
              (context, done) => {
                context.data.push("d");
                done();
              },
            ],
            [
              (context, done) => {
                context.data.push("e");
                done();
              },
              (context, done) => {
                context.data.push("f");
                done();
              },
            ]
          ),
          (context, done) => {
            context.data.push("z");
            done();
          },
        ],
        context
      );
      expect(context.data).toStrictEqual(["a", "b", "e", "f", "z"]);
    });
    it("should have an API for catching the end of the queue if the flow ends earlier", () => {
      const h1 = jest.fn();
      const h2 = jest.fn();
      const c = { foo: "bar" };
      Q([(context, done) => done(), (context, done) => done(false), h1], c, h2);

      expect(h1).not.toBeCalled();
      expect(h2).toBeCalledTimes(1);
      expect(h2).toBeCalledWith(c);
    });
    it("should have an API for catching the end of the queue if all the funcs finish", () => {
      const h1 = jest.fn().mockImplementation((context, done) => done());
      const h2 = jest.fn();
      const c = { foo: "bar" };
      Q([(context, done) => done(), (context, done) => done(), h1], c, h2);

      expect(h1).toBeCalledTimes(1);
      expect(h2).toBeCalledTimes(1);
      expect(h2).toBeCalledWith(c);
    });
  });
});
