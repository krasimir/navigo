import Navigo from '../../../src';

describe('Given the Navigo library on the page', function () {
  describe('and the feature described in #136', function () {
    it('should call the already hook', function () {
      var handler = sinon.spy();
      var alreadyHandler = sinon.spy();
      var router = new Navigo('http://site.com/', true);

      router.on('/:moduleName', handler, {
        already: alreadyHandler
      });

      router.resolve('/rock');
      router.resolve('/rock');
      router.resolve('/rock');
      router.resolve('/rock');

      expect(handler).to.be.calledOnce;
      expect(alreadyHandler.callCount).to.equal(3);
    });
  });
});
