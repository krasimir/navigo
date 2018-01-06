import Navigo from '../../../src';

var router;
// var browser = getBrowser();

describe('Given the Navigo library on the page', function () {
  beforeEach(function () {});
  afterEach(function () {});
  describe('and the problem described in #125', function () {
    it('should resolve the route', function () {
      var handler = sinon.spy();

      router = new Navigo('http://site.com/', true);
      router.on(/users\/(\d+)\/(\w+)\/?/, { as: 'trip.edit', uses: handler });
      expect(typeof router.generate('trip.edit', { a: 1 })).to.be.equal('string');
    });
  });
});
