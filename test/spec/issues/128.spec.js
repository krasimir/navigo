import Navigo from '../../../src';

var router;
// var browser = getBrowser();

describe('Given the Navigo library on the page', function () {
  describe('and the problem described in #128', function () {
    it('should resolve the route', function () {
      var handler = sinon.spy();

      router = new Navigo('http://site.com/', true);
      router.on('/:moduleName', handler);

      router.resolve('/rock/paper/scissors/');

      expect(handler).to.not.be.called;
    });
  });
});
