import Dog from "../dog";

describe("Given an instance of my Dog library", () => {
  describe("when I need the name", () => {
    it("should return the name", () => {
      const d = new Dog();
      expect(d.name).toEqual("Dog");
    });
  });
});
