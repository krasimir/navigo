import Navigo from '../../../src';
import { getBrowser } from '../../args';

var router;
var browser = getBrowser();

describe('Given the Navigo library on the page', function () {
  describe('and the feature described in #147', function () {
    (browser === 'PhantomJS' ? it.skip : it)('should provide an API for changing the history API method', function () {

      sinon.spy(window.history, 'pushState');
      sinon.spy(window.history, 'replaceState');

      router = new Navigo();

      router.navigate('/rock1');
      router.pause(true);
      router.navigate('/rock2');
      router.historyAPIUpdateMethod('pushState');
      router.navigate('/rock3');

      expect(window.history.pushState).to.be.calledTwice;
      expect(window.history.replaceState).to.be.calledOnce;

      window.history.pushState.restore();
      window.history.replaceState.restore();
    });
  });
});
