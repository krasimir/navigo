/* global beforeEach, afterEach */
import Navigo from '../../../src';
// import { getBrowser } from '../../args';

var router;
// var browser = getBrowser();

describe('Given the Navigo library on the page', function () {
  beforeEach(function () {
    
  });
  afterEach(function () {
    router.destroy();
  });
  describe('and we set beforeAll and afterAll hooks', function () {
    it('should call the hooks', function () {
      var handler = sinon.spy();
      var beforeAll = sinon.stub().callsArg(0);
      var afterAll = sinon.spy();

      router = new Navigo();
      router.hooks({
        before: beforeAll,
        after: afterAll
      });
      router.on({ '/user/:name': handler });
      router.resolve('/user/Krasimir%20Tsonev');

      expect(handler)
        .be.calledOnce
        .and.to.be.calledWith({
          name: 'Krasimir Tsonev'
        });
      expect(beforeAll)
        .to.be.calledOnce
        .and.to.be.calledWith(
          sinon.match.func,
          { name: 'Krasimir Tsonev' }
        );
      expect(afterAll)
        .to.be.calledOnce
        .and.to.be.calledWith({
          name: 'Krasimir Tsonev'
        });
    });
  });
  describe('and we set beforeAll and afterAll hooks on a defaultHandler handler', function () {
    it('should call the hooks', function () {
      var handler = sinon.spy();
      var beforeAll = sinon.stub().callsArg(0);
      var afterAll = sinon.spy();

      router = new Navigo();
      router.hooks({
        before: beforeAll,
        after: afterAll
      });
      handler = sinon.spy();
      router.on(handler);
      router.resolve('/');
      expect(handler).be.called;
      expect(beforeAll).to.be.calledOnce;
      expect(afterAll).to.be.calledOnce;
    });
  });
  describe('and we set beforeAll and afterAll hooks on a notFound handler', function () {
    it('should call the hooks', function () {
      var handler = sinon.spy();
      var beforeAll = sinon.stub().callsArg(0);
      var afterAll = sinon.spy();

      router = new Navigo();
      router.hooks({
        before: beforeAll,
        after: afterAll
      });
      handler = sinon.spy();
      router.notFound(handler);
      router.resolve('/a/b/c');
      expect(handler).be.called;
      expect(beforeAll).to.be.calledOnce;
      expect(afterAll).to.be.calledOnce;
    });
  });
  describe('and we set a leave handler on some of the routes', function () {
    it('should call the hooks', function (done) {
      var handler = sinon.spy();
      var leave = sinon.spy();
      var before = sinon.stub().callsArg(0);
      var after = sinon.spy();
      var notFound = sinon.spy();

      router = new Navigo(null, true);
      handler = sinon.spy();
      router.on('/user/:name', handler, {
        before: before,
        after: after,
        leave: leave
      });
      router.notFound(notFound);
      router.resolve('/user/Krasimir%20Tsonev');
      expect(handler).be.called;
      expect(handler).be.calledWith({
        name: 'Krasimir Tsonev'
      });
      expect(before).to.be.calledOnce;
      expect(after).to.be.calledOnce;
      router.navigate('/something/else');
      setTimeout(() => {
        expect(leave).to.be.calledOnce.and.to.be.calledWith({ name: 'Krasimir Tsonev' });
        expect(notFound).to.be.calledOnce;
        done();
      }, 200);
    });
  });
});
