import Navigo from '../../../src';

var router;

describe('Given the Navigo library on the page', function () {
  beforeEach(function () {

  });
  afterEach(function () {

  });
  describe('and the problem described in #116', function () {
    it('should handle properly the parameter', function () {
      var handler = sinon.spy();

      router = new Navigo();
      handler = sinon.spy();
      router.on({ '/user/:name': handler });
      router.resolve('/user/Krasimir%20Tsonev');
      expect(handler).be.called;
      expect(handler).be.calledWith({
        name: 'Krasimir Tsonev'
      });
    });
  });
});
