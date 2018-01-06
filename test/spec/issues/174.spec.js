import Navigo from '../../../src';

describe('Given the issue #174', function () {
  it('should call the handler when we pass a hook object but no before and after', function () {
    var handler = sinon.spy();
    var router = new Navigo('http://site.com/', false);
    var alreadyHandler = sinon.spy();
    var leaveHandler = sinon.spy();
    var aboutHandler = sinon.spy();

    router.on('/products/:id', handler, {
      already: alreadyHandler,
      leave: leaveHandler
    });
    router.on('/about', aboutHandler);

    router.resolve('/products/421');
    router.resolve('/products/421');
    router.resolve('/about');

    expect(handler).to.be.calledOnce.and.to.be.calledWith({ id: '421' });
    expect(alreadyHandler).to.be.calledOnce.and.to.be.calledWith({ id: '421' });
    expect(leaveHandler).to.be.calledOnce;
    expect(aboutHandler).to.be.calledOnce;
  });
});
