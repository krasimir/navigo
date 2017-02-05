import Navigo from '../../lib/navigo';

var router;

describe('Given the Navigo library on the page', function () {
  afterEach(function () {
    window.location.hash = '';
    history.pushState({}, '', '');
  });

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
  describe('when using the pause and resume method', function () {
    it('should NOT fire a handler', function () {
      router = new Navigo('/', false);

      let handler = sinon.spy();

      router.pause();
      router.on('page', handler);

      history.pushState({}, '', 'page');
      router.resolve();
      router.resume();
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
  describe('and the problem described in issue #57', function () {
    it('should not resolve any handler', function () {
      var router = new Navigo('/', false);
      var defaultHandler = sinon.spy();
      var handler = sinon.spy();
      var notFoundHandler = sinon.spy();

      router
        .on('something', handler)
        .on(defaultHandler)
        .notFound(notFoundHandler);

      window.location.hash = 'tab1';
      router.resolve();
      window.location.hash = 'tab2';
      router.resolve();

      expect(notFoundHandler).to.be.calledOnce;
      expect(defaultHandler).to.not.be.calledOnce;
      expect(handler).to.not.be.called;
    });
  });
  describe('and the problem described in issue #63', function () {
    it('should keep the trailing slash at the end', function () {
      var router = new Navigo();

      router.navigate('/something/else/');

      expect(window.location.href).to.match(/\/something\/else\//);
    });
  });
  describe('and the problem described in issue #70', function () {
    it('should resolve the notFound handler', function () {
      var router = new Navigo(null, true);
      var notFoundHandler = sinon.spy();
      var defaultHandler = sinon.spy();

      window.location.hash = 'missing';

      router.notFound(notFoundHandler);
      router.on(defaultHandler);
      router.resolve();

      expect(defaultHandler).not.to.be.calledOnce;
      expect(notFoundHandler).to.be.calledOnce;
    });
  });
  describe('and the problem described in issue #74', function () {
    it('should resolve the handler', function () {
      var router = new Navigo(null, true);
      var handler = sinon.spy();

      window.location.hash = '/محصولات/list';
      router.on('/محصولات/list', handler).resolve();

      expect(handler).to.be.calledOnce;
    });
  });
});
