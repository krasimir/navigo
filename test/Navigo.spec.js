import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Navigo from '../src/';

chai.expect();
chai.use(sinonChai);

const expect = chai.expect;

var router, handler;

describe.skip('Given an instance of Navigo', function () {

  describe('when we give no routes', function () {

    before(function () {
      router = new Navigo();
    });

    describe('and when we call check method', function () {
      it('should return false', function () {
        expect(router.check('test')).to.be.false;
      });
    });
  });

  describe('when we give routes', function () {

    describe('and when we pass only a handler', function () {
      it('should call the default handler', function () {
        router = new Navigo();
        handler = sinon.spy();
        router.on(handler);
        router.check('test');
        expect(handler).to.be.calledOnce();
      });
    });

  });

});