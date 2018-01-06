import Navigo from '../../../src';
// import { getBrowser } from '../../args';

var router;
// var browser = getBrowser();

describe('Given the Navigo library on the page', function () {
  describe('and the problem described in #111', function () {
    it('should not resolve the notFound handler', function () {
      var handler = sinon.spy();
      var notFoundHandler = sinon.spy();

      router = new Navigo('http://site.com/', false);
      router.on('/test', handler);
      router.notFound(notFoundHandler);

      router.resolve('/test#someanchor');

      expect(handler).to.be.calledOnce;
      expect(notFoundHandler).to.not.be.calledOnce;
    });
  });
});
