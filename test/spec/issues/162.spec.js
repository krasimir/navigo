import Navigo from '../../../src';

describe('Given the Navigo library on the page and the bug described in #162', function () {
  it('should properly resolve the route handler even tho there is no dynamic param', function () {
    window.__NAVIGO_WINDOW_LOCATION_MOCK__ = 'http://localhost:3000';

    const spy = sinon.spy();
    const router = new Navigo('http://localhost:3000', true, '#!');

    router.on({ '/home': spy });
    router.resolve('http://localhost:3000/#!/home?hey=bug');

    expect(spy)
      .to.be.calledOnce
      .and.to.be.calledWith(null, 'hey=bug');
  });
});
