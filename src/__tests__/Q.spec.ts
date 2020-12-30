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
    describe("and when we have other queues as items of the queue", () => {
      it("should process them", () => {
        const happen = [];
        Q([
          (context, done) => {
            happen.push("0");
            done();
          },
          Q.child([
            (context, done) => {
              happen.push("a");
              done();
            },
            (context, done) => {
              happen.push("b");
              done();
            },
          ]),
          Q.child([
            (context, done) => {
              happen.push("c");
              done();
            },
          ]),
          (context, done) => {
            happen.push("d");
            done();
          },
        ]);

        expect(happen).toStrictEqual(["0", "a", "b", "c", "d"]);
      });
    });
  });
});
