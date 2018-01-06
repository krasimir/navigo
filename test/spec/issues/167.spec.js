import Navigo from '../../../src';

describe('Given the issue #167', function () {
  it('should have parameterized routes that work', function () {
    var handler = sinon.spy();
    var router = new Navigo('http://site.com/', false);

    router.on('/products/:id', handler);

    router.resolve('/products/421');

    expect(handler).to.be.calledOnce.and.to.be.calledWith({ id: '421' });
  });
});
