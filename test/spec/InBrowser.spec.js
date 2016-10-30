import Navigo from '../../lib/navigo';

var router;

describe('Given the Navigo library on the page', function () {
  describe('when using the hash based routing', function () {
    it('should handle page routing', function () {
      router = new Navigo('/', true);

      let handler = sinon.spy();

      router.on('home', handler);

      window.location.hash = 'home';
      router.resolve();

      expect(handler).to.be.calledOnce;
    });
  });
  describe('when using the history API based routing', function () {
    it('should handle page routing', function () {
      router = new Navigo('/', false);

      let handler = sinon.spy();

      router.on('page', handler);

      history.pushState({}, '', 'page');
      router.resolve();

      expect(handler).to.be.calledOnce;
    });
  });
});
