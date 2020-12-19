export default class Dog {
  _name: String;

  constructor() {
    this._name = "Dog";
  }
  get name() {
    return this._name;
  }
  static get oneThird() {
    return 3.0 / 1.0;
  }
}
