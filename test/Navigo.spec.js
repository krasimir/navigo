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
    router = new Navigo(null, true);
  });

  describe('when we give no routes', function () {

    describe('and when we call resolve method', function () {
      it('should return false', function () {
        expect(router.resolve('test')).to.be.false;
      });
    });

  });

  describe('when we give routes', function () {

    describe('and when we pass only a handler', function () {
      it('should call the default handler', function () {
        handler = sinon.spy();
        router.on(handler);
        expect(handler).to.be.calledOnce;
      });
    });

    describe('and when we pass handler with no matching pattern', function () {
      it('should call the handler', function () {
        handler = sinon.spy();
        router.on('/missing/route', handler);
        router.resolve('test');
        expect(handler).to.not.be.called;
      });
    });

    describe('and when we pass handler with matching pattern', function () {
      var testCases = ['route', '/route', '/route/'];

      testCases.forEach(route => {
        it(`should call the handler if we pass ${route}`, function () {
          handler = sinon.spy();
          router.on({ [route]: handler });
          router.resolve('/someapp/route');
          expect(handler).to.be.calledOnce;
          handler.reset();
        });
      });
    });

    describe('and when we pass matching handler with dynamic parameters', function () {
      it('should call the handler by passing the parameters', function () {
        handler = sinon.spy();
        router.on({ '/user/:id': handler });
        router.resolve('site.com/app/users/42');
        expect(handler).to.not.be.called;
        expect(handler).to.not.be.calledWith(sinon.match({
          params: { id: 42 }
        }));
      });
    });

    describe('and when we pass matching handler with multiple dynamic parameters', function () {
      it('should call the handler by passing the parameters', function () {
        handler = sinon.spy();
        router.on({ '/user/:id/:action': handler });
        router.resolve('site.com/app/user/42/edit');
        expect(handler).to.be.calledWith({ id: '42', action: 'edit' });
      });
      describe('and there are more stuff in the url after that', function () {
        it('should call the handler by passing the parameters', function () {
          handler = sinon.spy();
          router.on({ '/user/:id/:action': handler });
          router.resolve('site.com/app/user/42/edit/something/else');
          expect(handler).to.be.called;
          expect(handler).to.be.calledWith({ id: '42', action: 'edit' });
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
        router.resolve('site.com/app/users/42/save');
      });
    });

    describe('and when we use the destroy method', function () {
      it('should not be able to resolve a route', function () {
        var handler = sinon.spy();
        router.on('/users', handler);
        router.resolve('site.com/app/users');
        router.destroy();
        router.resolve('site.com/app/users');
        expect(handler).to.be.calledOnce;
      });
    });

    describe('and when we use `useHash` set to true', function () {
      describe('and pass /:pattern as a route', function () {
        it('should not consider # as part of the route', function () {
          ['#bar', '#/bar'].forEach(function (bit) {
            var handler = sinon.spy();
            var r = new Navigo('site.com', true);
            r.on('/:foo', handler);
            r.resolve('site.com/' + bit);
            expect(handler).to.be.calledOnce.and.to.be.calledWith({ foo: 'bar' });
          });
        });
      });
    });

    describe('and when we pass three matching routes', function () {
      it('should call only one handler', function () {
        var handlerA = sinon.spy();
        var handlerB = sinon.spy();
        var handlerC = sinon.spy();
        var r = new Navigo();

        router.on('/', handlerA, true);
        router.on('/about', handlerB, true);
        router.on('/contacts', handlerC);
        expect(handlerA).to.be.calledOnce;
        expect(handlerB).to.not.be.calledOnce;
        expect(handlerC).to.not.be.calledOnce;
      });
    });

  });

  describe('when we use the link method', function () {
    it('should provide a proper url', function () {
      router = new Navigo('/my/root/here', true);
      expect(router.link('/foo')).to.be.equal('/my/root/here/foo');
      expect(router.link('/bar/foo')).to.be.equal('/my/root/here/bar/foo');
    });
  });

  describe('when we use only a dynamic parameter', function () {
    describe('and the url is matching root', function () {
      it('should call the handler with the right value', function () {
        var handler = sinon.spy();

        router = new Navigo('http://site.com/my/app/path', true);
        router._cLoc = sinon.stub().returns('http://site.com/my/app/path');
        router.on(':slug', handler);
        expect(handler).to.not.be.called;
      });
    });
    describe('and the url is NOT matching root', function () {
      it('should call the handler with the right value', function () {
        var handler = sinon.spy();

        router = new Navigo('http://site.com/my/app/path', true);
        router._cLoc = sinon.stub().returns('http://site.com/my/app/path/something/else');
        router.on(':slug', handler);
        expect(handler).to.be.calledWith({ slug: 'something' });
      });
    });
  });

  describe('when we want to catch the default route', function () {
    it('should call the handler with the right value', function () {
      var handler = sinon.spy();

      router = new Navigo('http://site.com/my/app/path', true);
      router._cLoc = sinon.stub().returns('http://site.com/my/app/path');
      router.on('/', handler);
      expect(handler).to.be.called;
    });
  });

  describe('when we create a named router', function () {
    it('should generate a proper link', function () {
      var handler = sinon.spy();

      router = new Navigo('http://site.com/', true);
      router.on('/trip/:tripId/edit', { as: 'trip.edit', uses: handler });
      expect(router.generate('trip.edit', { tripId: 42 })).to.be.equal('/trip/42/edit');
      router.resolve('/trip/42/edit');
      expect(handler)
        .to.be.calledOnce
        .and.to.be.calledWith({ tripId: '42' });
    });
    describe('and we set the routes via object', function () {
      it('should generate a proper link', function () {
        var handler = sinon.spy();

        router = new Navigo('http://site.com/', true);
        router.on({
          '/trip/:tripId/edit': { as: 'trip.edit', uses: handler },
          '/trip/save': { as: 'trip.save', uses: handler },
          '/trip/:action/:tripId': { as: 'trip.action', uses: handler }
        });
        expect(router.generate('trip.edit', { tripId: 42 })).to.be.equal('/trip/42/edit');
        expect(router.generate('trip.action', { tripId: 42, action: 'save' })).to.be.equal('/trip/save/42');
        expect(router.generate('trip.save')).to.be.equal('/trip/save');
        router.resolve('/trip/42/edit');
        expect(handler)
          .to.be.calledOnce
          .and.to.be.calledWith({ tripId: '42' });
      });
    });
  });

});