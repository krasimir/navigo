import Navigo from '../../../src';

var router;

describe('Given the Navigo library on the page', function () {
  describe('and the feature described in #146', function () {
    it('should resolve the proper route', function () {
      var handler1 = sinon.spy();
      var handler2 = sinon.spy();

      router = new Navigo();

      router.on({
        'restaurant': handler1,
        'demo/:name': handler2
      });

      router.navigate('/demo/myrestaurant');

      expect(handler1).to.not.be.calledOnce;
      expect(handler2)
        .to.be.calledOnce
        .and.to.be.calledWith({ name: 'myrestaurant' });

    });
  });
});
