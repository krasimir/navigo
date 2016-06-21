var expect = chai.expect;

var currentURL = function () {
  return window.location.href;
};
var r;

describe('Given Navigo library', function () {

  describe('when we give no routes and call the `resolve` method', function () {
    it('should return false', function () {
      r = new Navigo(root);
      expect(r.resolve(currentURL())).to.equal(false);
    });  
  });
  describe('when we register routes', function () {
    beforeEach(function () {
      r = new Navigo(root);
    });
    afterEach(function () {
      r.destroy();
      r.navigate('testing');
    });
    it('should call the default handler', function (done) {
      r.on(function() {
        done();
      }).resolve();
    });
    it('should call a handler if there is a matching route', function (done) {
      r.on('test-case/registered', function() {
        done();
      });
      r.navigate('test-case/registered');
    });
    it('should call the proper handler', function (done) {
      r.on('test-case/user', function () { done(); });
      r.on('test-case/user/42', function () {});
      r.navigate('test-case/user/42');
    }); 
    it('should work with parameterized routes', function (done) {
      r.on({
        'test-case/user/:id/:action': function (params) {
          expect(params.id).to.be.equal('42');
          expect(params.action).to.be.equal('save');
          r.navigate('thankyou/my dear user');
        },
        'thankyou/:username': function (params) {
          expect(decodeURIComponent(params.username)).to.be.equal('my dear user');
          done();
        }
      });
      r.navigate('test-case/user/42/save');
    }); 
    it('should work with regular expressions', function (done) {
      r.on(/test-case\/user\/(\d+)/, function (id) {
        expect(id).to.be.equal('42');
        done();
      });
      r.navigate('test-case/user/42');
    });
  });
  describe('when we update the internal state', function () {
    beforeEach(function () {
      r = new Navigo(root);
    });
    afterEach(function () {
      r.destroy();
      r.navigate('testing');
    });
    it('should not fire the resolve method', function (done) {
      var lang = '';

      r.on('/:lang/products', function (params) {
        lang = params.lang;
      });
      r.navigate('site.com/en/products');
      r.pause(true);
      r.navigate('site.com/foo/products');
      setTimeout(function () {
        r.navigate('site.com/bar/products');
      }, 10);
      setTimeout(function () {
        r.pause(false);
        r.navigate('site.com/bg/products');
        expect(lang).to.be.equal('bg');
        done();
      }, 20);
    });
  });
});