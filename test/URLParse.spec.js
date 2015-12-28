import chai from 'chai';
import { clean, match, root } from '../src/helpers/URLParse';

chai.expect();

const expect = chai.expect;
const routes = (...args) => args.map(r => {
  return { route: r };
});
const rootTestCases = [
  { 
    source: 'http://site.com', routes: routes(),
    expected: 'http://site.com'
  },
  { 
    source: 'https://site.com', routes: routes(),
    expected: 'https://site.com'
  },
  { 
    source: 'http://site.com/a/b', routes: routes(),
    expected: 'http://site.com/a/b'
  },
  { 
    source: 'http://site.com/a/b/', routes: routes(),
    expected: 'http://site.com/a/b'
  },
  { 
    source: 'http://site.com/a/b/', routes: routes('/b'),
    expected: 'http://site.com/a'
  },
  { 
    source: 'http://site.com/a/b/', routes: routes('/b', '/a/b/'),
    expected: 'http://site.com'
  },
  { 
    source: 'http://site.com/a/b/', routes: routes('/a/b/', '/b', '/c'),
    expected: 'http://site.com'
  },
  { 
    source: 'http://site.com/a/b/', routes: routes('/d/', '/a/b/', '/b', '/c'),
    expected: 'http://site.com'
  },
  { 
    source: 'http://site.com/something/else/brother/blah', routes: routes('/d/', '/a/b/', '/b', '/c'),
    expected: 'http://site.com/something/else/brother/blah'
  },
];

describe('Given the URLParse helper', function () {

  describe('when we use `clear` method', function () {
    it('should remove forward slashes', function () {
      expect(clean('/test/something/')).to.be.equal('/test/something')
    });
    it('should remove multiple forward slashes', function () {
      expect(clean('///test/something///')).to.be.equal('/test/something')
    });
  });

  describe('when we use `match` method', function () {
    it('should match a url if we have an empty string as a pattern', function () {
      expect(match('http://site.com/app/users/', routes(''))).to.not.be.false;
      expect(match('', routes(''))).to.not.be.false;
      expect(match('/some/path', routes(''))).to.not.be.false;
    });
    it('should not match if there is no pattern matching', function () {
      expect(match('http://site.com/app/users/', routes('missing'))).to.be.false;
    });
    it('should match and return parameters', function () {
      expect(match('http://site.com/app/users/42', routes('/users/:id')).params).to.be.deep.equal({ id: '42' });
    });
    it('should match multiple parameters', function () {
      expect(match('http://site.com/app/users/42/save', routes('/users/:id/:action')).params).to.be.deep.equal({ id: '42', action: 'save' });
    });
    it('should match multiple parameters even if there are more parts of the url after that', function () {
      expect(match(
        'http://site.com/app/users/42/save/something/else',
        routes('/users/:id/:action')).params
      ).to.be.deep.equal({ id: '42', action: 'save' });
    });
    it('should deal properly with multiple finds of same pattern', function () {
      expect(match('http://site.com/a/b/c/d', routes('/c')).match.index).to.be.equal(19);
    });
  });

  describe('when we use the `root` method', function () {
    rootTestCases.forEach(testCase => {
      (testCase.only ? it.only : it)(`should get the root as ${testCase.expected} if we sent
        source: ${testCase.source}
        routes: ${testCase.routes.map(r => r.route).join(', ')}`, function () {
         expect(root(testCase.source, testCase.routes)).to.be.equal(testCase.expected);
      });  
    });    
  });
});
