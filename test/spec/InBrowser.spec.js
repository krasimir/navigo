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
  describe('and the problem described in issue #56', function () {
    it('should resolve the notFound handler', function () {
      var router = new Navigo('/v1');
      var notFoundHandler = sinon.spy();
      var modifyHandler = sinon.spy();
      var defaultHandler = sinon.spy();

      router
      .notFound(notFoundHandler)
      .on('modify', modifyHandler)
      .on('modify/:name', modifyHandler)
      .on('/', defaultHandler);
      router.resolve('/v1/a/b/c');
      router.resolve('/v1/modify');
      router.resolve('/v1/modify/test');

      expect(defaultHandler).to.not.be.called;
      expect(notFoundHandler).to.be.called;
      expect(modifyHandler).to.be.calledTwice;
    });
  });
});
