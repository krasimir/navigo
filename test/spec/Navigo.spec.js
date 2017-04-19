import Navigo from '../../lib/navigo';

var router, handler;

describe('Given an instance of Navigo', function () {

  beforeEach(function () {
    window.location.hash = '';
    router = new Navigo(null, true);
    Navigo.MATCH_REGEXP_FLAGS = '';
  });

  afterEach(function(){
    router.destroy();
  });

  describe('when we set a not-found handler', function () {
    it('should call the not-found handler', function () {
      var notFoundRoute = sinon.spy();
      var defaultRoute = sinon.spy();
      var normalRoute = sinon.spy();

      router = new Navigo('http://site.com/', true);
      router.on('something', normalRoute);
      router.notFound(notFoundRoute);
      router.on(defaultRoute);

      router.resolve('/something');
      router.resolve('/something-else');
      router.resolve('/');

      expect(normalRoute).to.be.calledOnce;
      expect(notFoundRoute).to.be.calledOnce;
      expect(defaultRoute).to.be.calledOnce;
    });
  });
});
