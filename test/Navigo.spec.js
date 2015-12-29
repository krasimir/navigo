import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Notice that we are importing a lib file here.
// Consider using:
// import Navigo from '../src/';
import Navigo from '../lib/navigo';

chai.expect();
chai.use(sinonChai);

const expect = chai.expect;

var router, handler;

describe('Given an instance of Navigo', function () {

  beforeEach(function () {
    router = new Navigo();
  });

  describe('when we give no routes', function () {

    describe('and when we call check method', function () {
      it('should return false', function () {
        expect(router.check('test')).to.be.false;
      });
    });

  });

  describe('when we give routes', function () {

    describe('and when we pass only a handler', function () {
      it('should call the default handler', function () {
        handler = sinon.spy();
        router.on(handler);
        router.check('test');
        expect(handler).to.be.calledOnce;
      });
    });

    describe('and when we pass handler with no matching pattern', function () {
      it('should call the handler', function () {
        handler = sinon.spy();
        router.on('/missing/route', handler);
        router.check('test');
        expect(handler).to.not.be.called;
      });
    });

    describe('and when we pass handler with matching pattern', function () {
      var testCases = ['route', '/route', '/route/'];

      testCases.forEach(route => {
        it(`should call the handler if we pass ${route}`, function () {
          handler = sinon.spy();
          router.on(route, handler);
          router.check('/someapp/route');
          expect(handler).to.be.calledOnce;
          handler.reset();
        });
      });
    });

    describe('and when we pass matching handler with dynamic parameters', function () {
      it('should call the handler by passing the parameters', function () {
        handler = sinon.spy();
        router.on('/user/:id', handler);
        router.check('site.com/app/users/42');
        expect(handler).to.not.be.called;
        expect(handler).to.not.be.calledWith(sinon.match({
          params: { id: 42 }
        }));
      });
    });

    describe('and when we pass matching handler with multiple dynamic parameters', function () {
      it('should call the handler by passing the parameters', function () {
        handler = sinon.spy();
        router.on('/user/:id/:action', handler);
        router.check('site.com/app/users/42/edit');
        expect(handler).to.not.be.called;
        expect(handler).to.not.be.calledWith(sinon.match({
          params: { id: 42, action: 'edit' }
        }));
      });
      describe('and there are more stuff in the url after that', function () {
        it('should call the handler by passing the parameters', function () {
          handler = sinon.spy();
          router.on('/user/:id/:action', handler);
          router.check('site.com/app/users/42/edit/something/else');
          expect(handler).to.not.be.called;
          expect(handler).to.not.be.calledWith(sinon.match({
            params: { id: 42, action: 'edit' }
          }));
        });
      });
    });

    describe('and when we pass a regular expression as a pattern', function () {
      it('should call the handler and receive a regexp result object', function (done) {
        var handler = function (id, action) {
          expect(id).to.be.equal('42');
          expect(action).to.be.equal('save');
          done();
        };
        router.on(/users\/(\d+)\/(\w+)\/?/, handler);
        router.check('site.com/app/users/42/save');
      });
    });

  });

});