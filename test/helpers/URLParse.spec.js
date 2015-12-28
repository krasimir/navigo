import chai from 'chai';
// import sinon from 'sinon';
// import sinonChai from 'sinon-chai';
import { parse } from '../../src/helpers/URLParse';

chai.expect();
// chai.use(sinonChai);

const expect = chai.expect;
const cases = [
  { 
    source: 'http://site.com/',
    expected: 'http://site.com',
    patterns: []
  },
  { 
    source: 'http://site.com',
    expected: 'http://site.com',
    patterns: []
  },
  { 
    source: 'https://site.com/',
    expected: 'https://site.com',
    patterns: []
  },
  { 
    source: 'https://site.com/',
    expected: 'https://site.com',
    patterns: []
  },
  { 
    source: 'https://site.com/deep/path',
    expected: 'https://site.com/deep/path',
    patterns: []
  },
  { 
    source: 'http://site.com/deep',
    expected: 'http://site.com',
    patterns: ['deep']
  },
  { 
    source: 'http://site.com/deep/nested',
    expected: 'http://site.com',
    patterns: ['deep', 'deep/nested']
  },
  { 
    source: 'http://site.com/deep/nested',
    expected: 'http://site.com',
    patterns: ['deep/nested', 'deep']
  },
  { 
    source: 'http://site.com/deep/nested/?test=10#blahblah',
    expected: 'http://site.com',
    patterns: ['deep/nested', 'deep']
  },
  { 
    source: 'http://site.com/deep/nested',
    expected: 'http://site.com',
    patterns: ['something/else', '/deep/nested/']
  },
  { 
    source: 'http://site.com/deep/34/nested',
    expected: 'http://site.com',
    patterns: ['/deep/:id/nested/']
  },
  { 
    source: 'http://site.com/deep/34/nested/save',
    expected: 'http://site.com',
    patterns: ['/deep/:id/nested/:action']
  }
];

describe('Given the URLParse helper', function () {

  cases
    .reduce((state, current) => {
      if (!state.onlyOne) {
        state.all.push(current);
        if (current.only === true) {
          state.onlyOne = true;
          state.all = [ current ];
        }
      }
      return state;
    }, { all: [], onlyOne: false })
    .all
    .forEach(testCase => {
      describe(`when passing ${testCase.source} with patterns ${testCase.patterns.join(', ')}`, () => {
        it(`should return ${testCase.expected}`, () => {
          expect(parse(testCase.source, testCase.patterns).fullURL).to.be.equal(testCase.expected);
        });
      });
    });

  describe('when we pass a parameterized url', () => {
    it('should provide all the url params', () => {
      expect(parse('http://site.com/users/b89D23/save', ['/users/:id/:action']).params)
        .to.deep.equal({ id: 'b89D23', action: 'save' });
    });
    it('should provide all the url params even if there are more parts of the url', () => {
      var params = parse(
        'http://site.com/users/b89D23/save/more/stuff/here',
        ['/users/:id/:action']
      ).params;
      expect(params).to.have.property('id', 'b89D23');
      expect(params).to.have.property('action', 'save');
    });
    it('should return null as params if there is no parameters', () => {
      expect(parse('http://site.com/users', ['/users/:id', '/users']).params).to.equal(null);
    });
    it('should return the index of the matched pattern', () => {
      expect(parse(
        'http://site.com/users/42',
        ['/test/blah', '/users/:id', '/users', '/library/something']
      ).index).to.equal(1);
    });
  });
});
